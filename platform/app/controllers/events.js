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
                res.send(404);
                return;
            }
            res.send(events);
        });
    },
    register: function (req, res) {
                 
    }
};

module.exports = Events;

