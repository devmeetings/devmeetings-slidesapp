var Event = require('../models/event'),
    User = require('../models/user'),
    Activity = require('../models/activity'),
    _ = require('lodash'),
    Q = require('q'),
    Gravatar = require('gravatar');
    


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
            avatar: Gravatar.url(user.email)
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
                    avatar: Gravatar.url(user.email)
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
    }
};

module.exports = Events;

