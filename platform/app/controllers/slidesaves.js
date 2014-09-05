var Slidesave = require('../models/slidesave'),
    Q = require('q');


var onError = function (res) {
    return function (err) {
        console.error(err);
        res.send(400);
    };
};

var onDone = function () {
};

var Slidesaves = {
    create: function (req, res) {
        req.body.user = req.user._id;
        Q.ninvoke(Slidesave, 'create', req.body).then(function(slidesave) {
            res.send(200);
        }).fail(onError(res)).done(onDone);
    },
    get: function (req, res) {
        var user = req.user._id;
        var event = req.params.event;
        var slide = req.params.slide;

        Q.ninvoke(Slidesave.find({
            user: user,
            event: event,
            'slide._id': slide
        }).lean(), 'exec').then(function (slidesave) {
            res.send(slidesave);
        }).fail(onError(res)).done(onDone);
    }
};


module.exports = Slidesaves;
