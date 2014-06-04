var DeckModel = require('../models/deck');
var SlideModel = require('../models/slide');
var glob = require('glob');
var _ = require('lodash');

var sendAsRequireJSModule = function(object, res) {
    res.set('Content-Type', 'application/javascript');
    var data = (_.isArray(object) ? "define( []," : "define(") + JSON.stringify(object) + ");";
    res.send(data);
};

exports.getDeckSlides = function(req, res) {
    DeckModel.findById(req.params.id, function(err, deck) {
        if (err) {
            console.error(err);
            res.send(404, err);
            return;
        }

        SlideModel.find({
            '_id' : { $in: deck.slides }
        }, function(err, slides){
            if (err) {
                console.error(err);
                res.send(404, err);
                return;
            }
            sendAsRequireJSModule(slides.sort(function(a, b){
                var aIdx = deck.slides.indexOf(a._id);
                var bIdx = deck.slides.indexOf(b._id);
                return aIdx - bIdx;
            }), res);
        });
    });  
};

exports.getDeck = function(req, res) {
    DeckModel.findById(req.params.id, function(err, deck) {
        if (err) {
            res.send(404, err);
            return;
        }
        sendAsRequireJSModule(deck, res);
    });
};

exports.getSlide = function(req, res) {
    SlideModel.findById(req.params.id, function(err, slide) {
        if (err) {
            res.send(404, err);
            return;
        }
        sendAsRequireJSModule(slide, res);
    });
};

exports.pluginsPaths = function(req, res) {
    glob("public/plugins/**/*.js", function(err, files) {
        if (err) {
            res.send(404, err);
            return;
        }
        files = files.map(function(file) {
            return file.replace(/.js$/,'').replace(/^public\//,'');
        });
        sendAsRequireJSModule(files, res);
    });  
};
