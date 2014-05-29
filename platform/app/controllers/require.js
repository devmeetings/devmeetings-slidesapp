var DeckModel = require('../models/deck');
var SlideModel = require('../models/slide');
var glob = require('glob');
var _ = require('lodash');

var sendAsRequireJSModule = function(object, res) {
    res.set('Content-Type', 'application/js');
    var data = (_.isArray(object) ? "define( []," : "define(") + JSON.stringify(object) + ");";
    res.send(data);
};

exports.getDeckSlides = function(req, res) {
    DeckModel.findById(req.params.id, function(err, deck) {
        if (err) {
            console.error(err);
            res.send(404, []);
            return;
        }

        SlideModel.find({
            '_id' : { $in: deck.slides }
        }, function(err, slides){
            if (err) {
                console.error(err);
                res.send(404, []);
                return;
            }
            sendAsRequireJSModule(slides, res);
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
            file = file.substring(0, file.length - 3); // trim '.js'
            return file.substring(7, file.length); // trim public/ 
        });
        sendAsRequireJSModule(files, res);
    });  
};
