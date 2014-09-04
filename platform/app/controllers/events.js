var Event = require('../models/event'),
    User = require('../models/user'),
    Activity = require('../models/activity'),
    _ = require('lodash'),
    Q = require('q');
    

var onError = function (res) {
    return function (err) {
        console.error(err);
        res.send(400);
    };
};

var onDone = function () {
};

var addToPeopleArray = function (req, res, peopleName, activityName) {

    var userId = req.user._id.toString();
    var eventId = req.params.id;

    var eventPromise = Event.findOne({
        _id: eventId
    }).exec();

    var userPromise = User.findOne({
        _id: userId
    }).exec();

    Q.all([eventPromise, userPromise]).then(function (results) {
        var event = results[0];
        var user = results[1];

        var exists = _.find(event[peopleName], function (person) {
            return person.userId.toString() === userId; 
        });

        if (exists) {
            res.send(200);
            return;
        }

        event[peopleName].push({
            userId: userId, 
            name: user.name,
            avatar: user.avatar 
        });

        event.markModified(peopleName);
        event.save(function (err) {
            if (err) {
                console.error(err);
                res.send(400);
                return;
            }

            Activity.create({
                owner: {
                    userId: userId,
                    name: user.name,
                    avatar: user.avatar
                },
                type: activityName,
                data: {
                    title: event.title,
                    eventId: event._id,
                    linkId: event.trainingId
                }
            }, function (err, activity) {
                if (err) {
                    console.error(err);
                    res.send(400);
                    return;
                }
                res.send(200);
            });

        });
    });
};



var Events = {
    list: function (req, res) {
        var type = req.params.type;
        Event.find({
            type: type
        },function (err, events) {
            if (err) {
                console.error(err);
                res.send(400);
                return;
            }
            res.send(events);
        });
    },
    get: function (req, res) {
        var id = req.params.id;
        
        Q.ninvoke(Event.findOne({
            _id: id
        }), 'exec').then(function (event) {
            res.send(200);
        }).fail(onError(res)).done(onDone);
    },
    start: function (req, res) {
        addToPeopleArray(req, res, 'peopleStarted', 'video.start');
    },

    done: function (req, res) {
        addToPeopleArray(req, res, 'peopleFinished', 'video.done');
    },

    taskDone: function (req, res) {
        var userId = req.user._id;
        var event = req.params.event;
        var task = req.params.task;

        Q.ninvoke(Event.findOneAndUpdate({
            _id: event,
            slides: {
                $elemMatch: {
                    task: task,
                    'peopleFinished.userId': {
                        $ne: userId
                    }
                }
            }
        }, {
            $push: {
                'slides.$.peopleFinished': {
                    userId: userId,
                    name: req.user.name,
                    avatar: req.user.avatar
                }
            }
        }).lean(), 'exec').then(function (event) {
            if (!event) {
                return;
            }

            var result = _.find(event.slides, function (slide) {
                return slide.task === task;
            });

            return Q.ninvoke(Activity, 'create', {
                owner: {
                    userId: userId,
                    name: req.user.name,
                    avatar: req.user.avatar
                },
                type: 'task.done',
                data: {
                    title: result.task,
                    eventId: event._id,
                    linkId: result.slideId
                }
            });
        }).then(function () {
            res.send(200); 
        }).fail(onError(res)).done(onDone);
    },

    firstTask: function (req, res) {
        var eventId = req.params.id;
    
        Event.findOne({
            _id: eventId,
        }).exec().then(function (event) {
            if (!event) {
                return res.send(400);
            }

            var slide = _.first(event.slides);
            if (!slide) {
                return res.send(200);
            }
            res.send(slide.slideId.toString());


        }, function (err) {
            res.send(400);
        });
    },

    eventWithSlide: function (req, res) {
        var event = req.params.event;
        var slide = req.params.slide;
        Q.ninvoke(Event.findOne({
            _id: event,
            'slides.slideId': slide
        }).populate('slides.slideId').select('slides'), 'exec').then(function(event) {
            res.send(event);
        }).fail(onError(res)).done(onDone);
    },

    eventWithTraining: function (req, res) {
        var event = req.params.event;
        Q.ninvoke(Event.findOne({
            _id: event
        }).populate('trainingId').select('trainingId slides snippets tasks').lean(), 'exec').then(function (event) {
            res.send(event);
        }).fail(onError(res)).done(onDone);
    },
    addEventSnippet: function (req, res) {
        var event = req.params.event;

        Q.ninvoke(Event.findOneAndUpdate({
            _id: event
        },{
            $push: {
                snippets: req.body 
            }
        }).lean(), 'exec').then(function (event) {
            res.send(200, event.snippets[event.snippets.length - 1]);
        }).fail(onError(res)).done(onDone);
    }, 
    editEventSnippet: function (req, res) {
        var event = req.params.event;
        var snippet = req.params.snippet;
        Q.ninvoke(Event.findOneAndUpdate({
            _id: event,
            'snippets._id': snippet
        },{
            $set: {
                'snippets.$.title': req.body.title,
                'snippets.$.timestamp': req.body.timestamp,
                'snippets.$.markdown': req.body.markdown
            }
        }).lean(), 'exec').then(function (event) {
            res.send(200);
        }).fail(onError(res)).done(onDone);
    },
    deleteEventSnippet: function (req, res) {
        var event = req.params.event;
        var snippet = req.params.snippet;
        Q.ninvoke(Event.findOneAndUpdate({
            _id: event
        }, {
            $pull: {
                snippets: {
                    _id: snippet        
                }
            }
        }).lean(), 'exec').then(function (event) {
            res.send(200);
        }).fail(onError(res)).done(onDone);
    },
    addEventTask: function (req, res) {
        var event = req.params.event;

        Q.ninvoke(Event.findOneAndUpdate({
            _id: event
        },{
            $push: {
                tasks: req.body 
            }
        }).lean(), 'exec').then(function (event) {
            res.send(200, event.tasks[event.tasks.length - 1]);
        }).fail(onError(res)).done(onDone);
    }, 
    editEventTask: function (req, res) {
        var event = req.params.event;
        var task = req.params.task;
        Q.ninvoke(Event.findOneAndUpdate({
            _id: event,
            'task._id': task 
        },{
            $set: {
                'task.$.title': req.body.title,
                'task.$.timestamp': req.body.timestamp,
                'task.$.task': req.body.task
            }
        }).lean(), 'exec').then(function (event) {
            res.send(200);
        }).fail(onError(res)).done(onDone);
    },
    deleteEventTask: function (req, res) {
        var event = req.params.event;
        var task = req.params.task;
        Q.ninvoke(Event.findOneAndUpdate({
            _id: event
        }, {
            $pull: {
                tasks: {
                    _id: task
                }
            }
        }).lean(), 'exec').then(function (event) {
            res.send(200);
        }).fail(onError(res)).done(onDone);
    }

};

module.exports = Events;

