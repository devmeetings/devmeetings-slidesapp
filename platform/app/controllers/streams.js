var _ = require('lodash'), 
    Activity = require('../models/activity'),
    Observe = require('../models/observe');

var Streams = {
    all: function (req, res) {
        //var observer = req.user._id.toString();

        Activity.find({}).sort({_id:-1}).limit(50).exec().then(function (activities) {
            res.send(activities);
        });
        /*
        Observe.findOne({
            observer: observer
        }).exec().then(function (observe) {
            if (!observe) {
                res.send([]);
                return;
            }
            return Activity.find({
                'owner.userId' : {
                    $in: _.pluck(observe.observed, 'userId')
                }
            }).sort({_id:-1}).limit(50).exec();
        }).then(function (activities) {
            res.send(activities);
        });*/
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

