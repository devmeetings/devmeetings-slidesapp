var Q = require('q'),
    _ = require('lodash'),
    Observe = require('../models/observe'),
    User = require('../models/user');

var Observes = {
    get: function (req, res) {
        var observer = req.user._id.toString();

        Observe.findOneAndUpdate({
            observer: observer
        }, {}, {
            upsert: true
        }, function (err, observe) {
            if (err) {
                console.error(err);
                res.send(400);
                return;
            }
            res.send(observe);
        });
    },


    observe: function (req, res) {
        var observer = req.user._id.toString();
        var observedId = req.body.id;

        var userPromise = User.findOne({
            _id: observedId
        }).exec();
        var observePromise = Observe.findOneAndUpdate({
            observer: observer
        }, {}, {
            upsert: true
        }).exec();

        Q.all([userPromise, observePromise]).then(function (arr) {
            var user = arr[0];
            var observe = arr[1];
            observe.observed = observe.observed || [];
            
            if (_.findIndex(observe.observed, function (observed) {
                return observed.userId.toString() === observedId;
            }) !== -1) {
                res.send(200);
                return;
            }

            observe.observed.push({
                userId: observedId,
                name: user.name,
                avatar: user.avatar
            });

            observe.markModified('observed');
            observe.save(function (err) {
                if (err) {
                    console.error(err);
                    res.send(400);
                    return;
                }
                res.send(200);
            });
        });
    },

    unobserve: function (req, res) {
        var observer = req.user._id.toString();
        var observedId = req.params.id;

        Observe.findOne({
            observer: observer
        }, function (err, observe) {
            if (err) {
                console.error(err);
                res.send(400);
                return;
            }
            if (!observe) {
                res.send(400);
                return;
            }
       
            var index = _.findIndex(observe.observed, function (observed) {
                return observed.userId.toString() === observedId;
            });
            
            if (index === -1) {
                res.send(200);
                return;
            }

            observe.observed.splice(index, 1);
            observe.markModified('observed');
            observe.save(function (err) {
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


module.exports = Observes;
