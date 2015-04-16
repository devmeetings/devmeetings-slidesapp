var SlideModel = require('../models/slide');
var Slides = require('../services/slides');
var _ = require('lodash');
var logger = require('../../config/logging');

exports.create = function(req, res) {
    var contents = (_.isArray(req.body) ? req.body : [req.body]).map(function(slide) {
        return {
            content: slide
        };
    });

    SlideModel.create(contents, function(err) {
        if (err) {
            logger.error(err);
            res.send(404, err);
            return;
        }
        var slides = Array.prototype.slice.call(arguments, 1);
        res.send(_.pluck(slides, "_id"));
    });
};

exports.get = function(req, res) {

    Slides.findSlide(req.params.id).then(function(slide) {
        res.send(slide);
    }, function(err) {
        logger.error(err);
        res.send(404, err);
    });

};

exports.list = function(req, res) {
    SlideModel.find(function(err, slides) {
        if (err) {
            logger.error(err);
            res.send(404, err);
            return;
        }
        res.send(slides);
    });
};
