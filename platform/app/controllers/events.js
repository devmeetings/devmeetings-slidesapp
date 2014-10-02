var Event = require('../models/event'),
    User = require('../models/user'),
    Activity = require('../models/activity'),
    _ = require('lodash'),
    Q = require('q'),
    srt = require('srt'),
    path = require('path'),
    fs = require('fs'),
    config = require('../../config/config'),
    Recording = require('../models/recording'),
    MongoBridge = require('../services/raw-mongo-bridge');
    
var soundsDir = path.join(__dirname, '..', '..', 'public', 'sounds');
var soundsUrl = '/static/sounds/';
var idPattern = /ID\: (.+)$/;

var onError = function (res) {
    return function (err) {
        console.error(err);
        res.send(400);
    };
};

var onDone = function () {
};

var Events = {
    all: function (req, res) {
        Q.ninvoke(Event.find({}).select('title description image order visible').lean(), 'exec').then(function (events) {
            res.send(events); 
        }).fail(onError(res)).done(onDone);
    },

    get: function (req, res) {
        var id = req.params.id;
        
        Q.ninvoke(Event.findOne({
            _id: id
        }).populate('trainingId').lean(), 'exec').then(function (event) {
            res.send(event);
        }).fail(onError(res)).done(onDone);
    },
        
    eventTaskDone: function (req, res) {
        var done = req.params.done === 'true' ? true : false;
        var update = {};
        if (done) {
            update.$set = {};
            update.$set['ranking.people.$.tasks.' + req.params.task] = true; 
        } else {
            update.$unset = {};
            update.$unset['ranking.people.$.tasks.' + req.params.task] = '';
        }

        Q.ninvoke(Event.findOneAndUpdate({
            _id: req.params.event,
            'ranking.people.user': {
                $ne: req.user._id
            }
        }, {
            $push: {
                'ranking.people': {
                    user: req.user._id,
                    name: req.user.name,
                    avatar: req.user.avatar,
                    tasks: {}
                }
            }
        }).lean(), 'exec').then(function (event) {
            return Q.ninvoke(Event.findOneAndUpdate({
                _id: req.params.event,
                'ranking.people.user': req.user._id
            }, update).lean(), 'exec');
        }).then(function (event) {
            res.send(200);
        }).fail(onError(res)).done(onDone);
    },
    
    changeVisibility: function (req, res) {
        var event = req.params.event;
        var visible = req.params.visible === 'true' ? true : false;

        Q.ninvoke(Event.findOneAndUpdate({
            _id: event
        }, {
            $set: {
                visible: visible
            }
        }).lean(), 'exec').then(function (event) {
            res.send(200);
        }).fail(onError(res)).done(onDone);
    },

    delete: function (req, res) {
        Q.ninvoke(Event.findOneAndRemove({
            _id: req.params.event
        }).lean(), 'exec').then(function () {
            res.send(200);
        }).fail(onError(res)).done(onDone);
    },

    create: function (req, res) {
        Q.ninvoke(Event, 'create', req.body).then(function (event) {
            res.send(event); 
        }).fail(onError(res)).done(onDone);
    },

    eventIterationCreate: function (req, res) {
        Q.ninvoke(Event.findOneAndUpdate({
            _id: req.params.event
        }, {
            $push: {
                iterations: req.body
            }
        }).lean(), 'exec').then(function (event) {
            res.send(event.iterations.pop());
        }).fail(onError(res)).done(onDone);
    },
    eventIterationDelete: function (req, res) {
        Q.ninvoke(Event.findOneAndUpdate({
            _id: req.params.event
        }, {
            $pull: {
                iterations: {
                    _id: req.params.iteration            
                }
            }
        }).lean(), 'exec').then(function (event) {
            res.send(200);
        }).fail(onError(res)).done(onDone);
    },

    eventMaterialCreate: function (req, res) {
        var title = req.body.title || 'no name';

        Q.nfcall(srt, req.files.captions.path).then(function(captions) {
            captions = _.values(captions);
            // convert captions to recordings
            var slides = captions.map(function(caption) {
                var idData = idPattern.exec(caption.text);
                var id = idData ? idData[1] : null;

                return {
                    timestamp: caption.startTime,
                    snapshotId: id
                };
            }).filter(function(x) {
                return x.snapshotId !== null;
            });

            // fetch appropriate slides
            return MongoBridge(config.db).then(function(mongo) {
                var toFetch = slides.map(function(s) {
                    return s.snapshotId;
                });
                return mongo.getRawRecordingsByIds(toFetch);
            }).then(function(recordings) {
                // Create a set
                var slideSet = recordings.reduce(function(acc, rec) {
                    acc[rec._id] = rec;
                    return acc;
                }, {});
            
                
                // map slides
                var slidesContent = slides.map(function(slide) {
                    var s = slideSet[slide.snapshotId];
                    s.timestamp = slide.timestamp;
                    return s;
                });

                // Create recording
                return Q.ninvoke(Recording, 'create', {
                    title: title,
                    group: title,
                    date: new Date(),
                    slides: slidesContent
                });
            }).then(function(recording) {
                // Rename audio
                var audioPath = path.join(soundsDir, req.files.audio.name);
                var audio = Q.ninvoke(fs, 'rename', req.files.audio.path, audioPath);
        
                var event = Q.ninvoke(Event.findOneAndUpdate({
                    _id: req.params.event,
                    'iterations._id': req.params.iteration
                }, {
                    $push: {
                        'iterations.$.materials': {
                            title: title,
                            url: soundsUrl + req.files.audio.name,
                            material: recording._id
                        }
                    }
                }).lean(), 'exec');

                return Q.all([audio, event]);
            });
            
        }).then(function (data) {
            res.redirect('/?edit=true#/space/' + req.params.event);
        }).fail(onError(res)).done(onDone);
    }, 

    eventMaterialDelete: function (req, res) {
                         
    },

    annotationCreate: function(req, res) {
        var eventId = req.params.event;
        var iterationId = req.params.iteration;
        var materialId = req.params.material;

        Q.ninvoke(Event.findOneAndUpdate({
            '_id': eventId,
            'iterations._id': iterationId,
            'iterations.$.materials._id': materialId,
        }, {
            $push: {
                'iterations.$.materials.$.annotations': req.body
            }
        }).lean(), 'exec').then(function(data){
            res.send(data);
        }).fail(onError(res)).done(onDone);
        
    } 


};

module.exports = Events;

