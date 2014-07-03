var Event = require('../models/event');
var _ = require('lodash');

var EventsCtrl = {
    list: function (req, res) {
        Event.find(function (err, events) {
            if (err) {
                console.error(err);
                res.send(404);
                return;
            }
            res.send(events);
        });
    }
};

module.exports = EventsCtrl;

