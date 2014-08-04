var Event = require('../models/event'),
    User = require('../models/user'),
    _ = require('lodash'),
    Q = require('q');

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
    register: function (req, res) {
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

            var exists = _.find(event.people, function (person) {
                return person.userId.toString() === userId; 
            });

            if (exists) {
                res.send(200);
                return;
            }

            event.people.push({
                userId: userId, 
                mail: user.email
            });

            event.markModified('people');
            event.save(function (err) {
                if (err) {
                    console.error(err);
                    res.send(400);
                    return;
                }
                res.send(200);
            });
        });
    }
};

module.exports = Events;

