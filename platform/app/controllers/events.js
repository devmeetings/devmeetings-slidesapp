var Event = require('../models/event'),
    User = require('../models/user'),
    Activity = require('../models/activity'),
    _ = require('lodash'),
    Q = require('q');
    


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
        Event.findOne({
            _id :id
        }, function (err, event) {
            if (err) {
                console.error(err);
                res.send(400);
                return;
            }
            res.send(event);
        });
    },
    start: function (req, res) {
        addToPeopleArray(req, res, 'peopleStarted', 'video.start');
    },

    done: function (req, res) {
        addToPeopleArray(req, res, 'peopleFinished', 'video.done');
    },

    task_done: function (req, res) {
        var userId = req.user._id;
        var eventId = req.params.id;
        var slideId = req.params.slide;

        var eventPromise = Event.findOne({
            _id: eventId,
            'slides.slideId': slideId
        }).exec();

        var userPromise = User.findOne({
            _id: userId
        }).exec();

        Q.all([eventPromise, userPromise]).then(function (results) {
            var event = results[0];
            var user = results[1];
            var slide = _.find(event.slides, function (slide) {
                return slide.slideId.toString() === slideId;
            });

            if (!event) {
                return 400;
            }

            var exists = _.find(slide.peopleFinished, function (person) {
                return person.userId.toString() === userId;
            });

            if (exists) {
                return 200;
            }

            slide.peopleFinished.push({
                userId: userId,
                name: user.name,
                avatar: user.avatar
            });

            event.markModified('slides');
            return Q.ninvoke(event, 'save').then(function (event) {
                return Q.ninvoke(Activity, 'create', {
                    owner: {
                        userId: userId, 
                        name: user.name,
                        avatar: user.avatar
                    },
                    type: 'task.done',
                    data: {
                        title: event.title,
                        eventId: event._id,
                        linkId: slideId
                    }
                }).then( function (activity) {
                    return 200;
                });
            });
        }).then(function(code){
            res.send(code);
        }).fail(function (err) {
            res.send(400);
        });

    }
};

module.exports = Events;

