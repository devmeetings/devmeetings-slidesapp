var Slidesave = require('../models/slidesave'),
    Slide = require('../models/slide'),
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
    slidesaveFromSlide: function (req, res) {
        var slide = req.params.slide;
        Q.ninvoke(Slide.findOne({
            _id: slide
        }).lean(), 'exec').then(function (slide) {
            var toInsert = {
                user: req.user._id,
                slide: slide.content,
                title: 'default slide',
                timestamp: new Date()
            };
            return Q.ninvoke(Slidesave, 'create', toInsert);
        }).then(function (slidesave) {
            res.send({
                slidesave: slidesave._id
            });
        })
        
        .fail(onError(res)).done(onDone);
    },
    create: function (req, res) {
        req.body.user = req.user._id;
        Q.ninvoke(Slidesave, 'create', req.body).then(function(slidesave) {
            res.send({
                slidesave: slidesave._id
            });
        }).fail(onError(res)).done(onDone);
    },
    all: function (req, res) {
        Q.ninvoke(Slidesave.find({
            user: req.user._id
        }).select('title timestamp').lean(), 'exec').then(function (slidesaves) {
            res.send(slidesaves);
        }).fail(onError(res)).done(onDone);
    },
    get: function (req, res) {
        var slide = req.params.slide;

        Q.ninvoke(Slidesave.findOne({
            _id: slide
        }).lean(), 'exec').then(function (slidesave) {
            res.send(slidesave);
        }).fail(onError(res)).done(onDone);
    },
    edit: function (req, res) {
        var slide = req.params.slide;

        delete req.body._id;
        Q.ninvoke(Slidesave.findOneAndUpdate({
            _id: slide
        }, req.body).lean(), 'exec').then(function (slidesave) {
            res.send(200);
        }).fail(onError(res)).done(onDone);
    },
    delete: function (req, res) {
        var slide = req.params.slide;

        Q.ninvoke(Slidesave.findOneAndRemove({
            _id: slide
        }).lean(), 'exec').then(function (slidesave) {
            res.send(200);
        }).fail(onError(res)).done(onDone);
    }
};


module.exports = Slidesaves;
