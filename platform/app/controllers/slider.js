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


exports.deck = function(req, res) {
    res.render('slider/deck', {
        title: 'Devmeetings.pl',
        slides: req.params.slides,
        editMode: req.query.edit,
        jsModulesPath: req.jsModulesPath,
        doLiveReload: req.doLiveReload
    });
};

exports.slide = function(req, res) {
    res.render('slider/slide', {
        title: 'Slide',
        slide: req.params.slide,
        editMode: req.query.edit,
        jsModulesPath: req.jsModulesPath,
        doLiveReload: req.doLiveReload
    });
};

exports.trainer = function(req, res) {
    res.render('slider/trainer', {
        title: "Trainer's Screen",
        slides: req.params.slides,
        jsModulesPath: req.jsModulesPath,
        doLiveReload: req.doLiveReload
    });
};