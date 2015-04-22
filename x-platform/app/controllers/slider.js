var _ = require('lodash');

var stdReq = function(req, obj) {

    return _.extend({
        editMode: req.query.edit,
        jsModulesPath: req.jsModulesPath,
        withGoogleAnalytics: req.withGoogleAnalytics,
        withInspectlet: req.withInspectlet,
        cacheBustingVersion: req.cacheBustingVersion
    }, obj);
};


exports.index = function(req, res) {
    var DeckModel = require('../models/deck');

    DeckModel.find(function(err, decks) {
        if (err) {
            res.render(500, err);
            return;
        }
        res.render('main/main', stdReq(req, {
            title: 'Xplatform',
            decks: decks,
            cacheBustingVersion: req.cacheBustingVersion
        }));
    });
};

exports.deck = function(req, res) {
    res.render('slider/deck', stdReq(req, {
        title: 'Deck',
        withGoogleAnalytics: req.withGoogleAnalytics,
        slides: req.params.slides,
        from: req.query.from,
        to: req.query.to
    }));
};

exports.slide = function(req, res) {
    res.render('slider/slide', stdReq(req, {
        title: 'Slide',
        slide: req.params.slide
    }));
};

exports.trainer = function(req, res) {
    res.render('slider/trainer', stdReq(req, {
        title: "Trainers Screen",
        slides: req.params.slides
    }));
};
