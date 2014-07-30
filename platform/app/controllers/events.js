var Event = require('../models/event');
var _ = require('lodash');

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
                 
    }
};

module.exports = Events;

