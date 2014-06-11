exports.index = function(req, res) {
    var DeckModel = require('../models/deck');

    DeckModel.find(function(err, decks) {
        if (err) {
            res.render(500, err);
            return;
        }
        res.render('slider/index', {
            title: 'Xplatform',
            decks: decks,
            events: [{
                title: 'JS contexty',
                date: '-'
            }, {
                title: 'iOS - wprowadzenie',
                date: '-'
            }, {
                title: 'Swift - poczatki',
                date: '-'
            }]
        });
    });
};

var _ = require('lodash');
var stdReq = function(req, obj) {

    return _.extend({
        editMode: req.query.edit,
        jsModulesPath: req.jsModulesPath,
        doLiveReload: req.doLiveReload,
        withGoogleAnalytics: req.withGoogleAnalytics,
        withInspectlet: req.withInspectlet
    }, obj);
};

exports.deck = function(req, res) {
    res.render('slider/deck', stdReq(req, {
        title: 'Devmeetings.pl',
        slides: req.params.slides,
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
        title: "Trainer's Screen",
        slides: req.params.slides
    }));
};