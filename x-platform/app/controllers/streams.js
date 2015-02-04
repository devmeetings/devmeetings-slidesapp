var _ = require('lodash'), 
    Activity = require('../models/activity'),
    Observe = require('../models/observe');

var Streams = {
    all: function (req, res) {
        Activity.find({}).sort({_id:-1}).limit(50).exec().then(function (activities) {
            res.send(activities);
        });
    },
    get: function (req, res) {
        var observedId = req.params.id;
        Activity.find({
            'owner.userId' : observedId
        }).sort({_id:-1}).limit(50).exec().then(function (activities) {
            res.send(activities);
        });
    }
};

module.exports = Streams;

