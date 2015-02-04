var SlideModel = require('../models/slide');
var Slides = require('../services/slides');
var _ = require('lodash');

exports.create = function(req, res) {
    var contents = (_.isArray(req.body) ? req.body : [req.body]).map(function(slide) {
        return {
            content: slide
        };
    });

    SlideModel.create(contents, function(err) {
        if (err) {
            console.error(err);
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
        console.error(err);
        res.send(404, err);
    });

};

exports.list = function(req, res) {
    SlideModel.find(function(err, slides) {
        if (err) {
            console.error(err);
            res.send(404, err);
            return;
        }
        res.send(slides);
    });
};