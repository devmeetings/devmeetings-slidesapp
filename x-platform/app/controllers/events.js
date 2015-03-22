var Event = require('../models/event'),
    Slidesave = require('../models/slidesave'),
    Annotations = require('../models/annotations'),
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
        Q.ninvoke(Event.find({
          removed: {
            $ne: true
          }
        }).select('title description image order visible').lean(), 'exec').then(function (events) {
            res.send(events); 
        }).fail(onError(res)).done(onDone);
    },

    userEvents: function(req, res) {
      Q.ninvoke(Slidesave.find({
        user: req.params.userId,
        event: {
          $exists: true
        }
      }).select('event').lean(), 'exec').then(function(events){
        var eventsIds = _.unique(events.map(function(e) {
          return e.event.toString();
        }));
        res.send(eventsIds);
      }).fail(onError(res));
    },

    get: function (req, res) {
        var id = req.params.id;
        
        Q.ninvoke(Event.findOne({
            _id: id
        }).lean(), 'exec').then(function (event) {
            res.send(event);
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

    eventMaterialCreate: function (req, res) {
        var title = req.body.title || 'no name';

        Q.nfcall(srt, req.files.captions.path).then(function(captions) {
            captions = _.values(captions);
            // convert captions to recordings
            var slides = captions.map(function(caption) {
                // var idData = idPattern.exec(caption.text);
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

    getAllAnnotations: function(req, res) {
      var eventId = req.params.id;
      Q.ninvoke(Event.findOne({
            _id: eventId
      }).lean(), 'exec').then(function gatherAllAnnotations(event) {
          return _.reduce(event.iterations, function(acc, iteration) {
              return acc.concat(_.reduce(iteration.materials, function(subacc, material) {
                  return subacc.concat(material.annotations);
              }, []));
          }, []);
      }).then(function fetchFromDb(annotations) {
        return Q.ninvoke(Annotations.find({
          _id: {
            $in: annotations
          }
        }), 'exec');
      }).then(function sendResponse(annos) {
        res.send(annos.reduce(function(memo, a) {
          return memo.concat(a.annotations);
        }, []));
      }).done(onDone);
    },

    getAnnotations: function(req, res) {
      var id = req.params.annotationId;
      if (!id || id === 'undefined') {
        return res.send([]);
      }
      Events._findAnnotation(id).then(function(anno){
        res.send(anno.annotations);
      }).done(onDone);
    },

    _findEventAndMaterial: function(eventId, iterationIdx, materialId) {
        return Q.ninvoke(Event.findOne({
            _id: eventId
        }), 'exec').then(function(ev) {
            var material = _.map(ev.iterations[iterationIdx].materials, function(x){
                return x._id.toString();
            }).indexOf(materialId);
            material = ev.iterations[iterationIdx].materials[material];

            if (!material) {
                throw new Error("Material not found");
            }
            return [ev, material];
        });
    },

    _findAnnotation: function(annotationId) {
      return Q.ninvoke(Annotations, 'findById', annotationId);
    },

    annotationCreate: function(req, res) {
        var eventId = req.params.event;
        var iterationIdx = req.params.iteration;
        var materialId = req.params.material;

        Events._findEventAndMaterial(eventId, iterationIdx, materialId).then(function(data){
            var material = data[1];
            
            return Q.ninvoke(Annotations.findOneAndUpdate({
              _id: material.annotations
            },{
              $push: {
                'annotations': req.body
              }
            }).lean(), 'exec');

        }).fail(onError(res)).done(function(data){
            res.send(data);
        });
    },

    annotationEdit: function(req, res) {
        var eventId = req.params.event;
        var iterationIdx = req.params.iteration;
        var materialId = req.params.material;
        var annotationId = req.params.id;

         Events._findEventAndMaterial(eventId, iterationIdx, materialId).then(function(data){
            var material = data[1];

            return Events._findAnnotation(material.annotations).then(function(anno){
              var annoIdx = _.map(anno.annotations, function(x){
                  return x._id.toString();
              }).indexOf(annotationId);

              var annotation = anno.annotations[annoIdx];
              _.each(req.body, function(val, k) {
                  annotation[k] = val;
              });
              return Q.ninvoke(anno, 'save');
            });

        }).fail(onError(res)).done(function(data){
            res.send(data);
        });
    }


};

module.exports = Events;

