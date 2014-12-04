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

var transformToSlidesave = function (slide, user) {
    return {
        user: user,
        slide: slide.content,
        baseSlide: slide._id,
        title: 'default workspace',
        timestamp: new Date()
    };
};

var transformToSlideChannelsave = function (slide, channel) {
    return {
        channel: channel,
        slide: slide.content,
        baseSlide: slide._id,
        title: 'default workspace',
        timestamp: new Date()
    };
};

var Slidesaves = {
    doEdit: function (userId, slide, data, callback) {
        Slidesave.findOneAndUpdate({
            //user: userId, // TODO temporary ignoring workspace owner
            _id: slide
        }, data).lean().exec(callback);
    },

    slidesaveFromSlide: function (req, res) {
        var slide = req.params.slide;
        Q.ninvoke(Slide.findOne({
            _id: slide
        }).lean(), 'exec').then(function (slide) {
            var toInsert = transformToSlidesave(slide, req.user._id);
            return Q.ninvoke(Slidesave, 'create', toInsert);
        }).then(function (slidesave) {
            res.send({
                slidesave: slidesave._id
            });
        }).fail(onError(res)).done(onDone);
    },
    create: function (req, res) {
        req.body.user = req.user._id;
        Q.ninvoke(Slidesave, 'create', req.body).then(function (slidesave) {
            res.send({
                slidesave: slidesave._id
            });
        }).fail(onError(res)).done(onDone);
    },
    all: function (req, res) {
        Q.ninvoke(Slidesave.find({
            user: req.user._id
        }).select('title timestamp baseSlide').lean(), 'exec').then(function (slidesaves) {
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
        Slidesaves.doEdit(req.user._id, slide, req.body, function (err, data) {
            if (err) {
                onError(res)(err);
                return;
            }
            res.send(200);
        });
    },
    delete: function (req, res) {
        var slide = req.params.slide;

        Q.ninvoke(Slidesave.findOneAndRemove({
            _id: slide
        }).lean(), 'exec').then(function (slidesave) {
            res.send(200);
        }).fail(onError(res)).done(onDone);
    },

    baseSlide: function (findBy, toInsertCallback, res) {
        Q.ninvoke(Slidesave.findOne(findBy).lean(), 'exec').then(function (slidesave) {
            if (slidesave) {
                return slidesave;
            }
            return Q.ninvoke(Slide.findOne({
                _id: findBy.baseSlide
            }).lean(), 'exec').then(function (slide) {
                var toInsert = toInsertCallback(slide);
                return Q.ninvoke(Slidesave, 'create', toInsert);
            });
        }).then(function (slidesave) {
            res.send({
                slidesave: slidesave._id
            });
        }).fail(onError(res)).done(onDone);
    },

    baseSlideByUser: function (req, res) {
        var slide = req.params.slide, findBy = {
            user: req.user._id,
            baseSlide: slide
        };

        Slidesaves.baseSlide(findBy, function (slide) {
            return transformToSlidesave(slide, req.user._id);
        }, res);
    },

    baseSlideByChannel: function (req, res) {
        var slide = req.params.slide, channel = req.params.channel, findBy = {
            channel: channel,
            baseSlide: slide
        };

        Slidesaves.baseSlide(findBy, function (slide) {
            return transformToSlideChannelsave(slide, channel);
        }, res);

    }

};


module.exports = Slidesaves;
