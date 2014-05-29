var SlideModel = require('../models/slide');
var _ = require('lodash');

exports.create = function(req, res) {
    var contents = (_.isArray(req.body) ? req.body : [req.body]).map( function(slide) {
        return { content : slide };
    }); 

    SlideModel.create(contents, function (err) {
        if (err){
            console.error(err);
            res.send(404, err);
            return;
        }
        var slides = Array.prototype.slice.call(arguments, 1);
        res.send(_.pluck(slides, "_id"));
    });
};

exports.get = function(req, res) {
    SlideModel.findById(req.params.id, function(err, slide) {
        if (err){
            console.log(err);
            res.send(404, err);
            return;
        }
        res.send(slide);
    });
};

