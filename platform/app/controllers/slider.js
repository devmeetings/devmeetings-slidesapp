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
                date: '19-06-14'
            }, {
                title: 'iOS - wprowadzenie',
                date: '20-06-14'
            }, {
                title: 'Swift - poczatki',
                date: '22-06-14'
            }
            ]
        });
    });
};


exports.deck = function(req, res) {
    res.render('slider/deck', {
        title: 'Devmeetings.pl',
        slides: req.params.slides,
        editMode: req.query.edit
    });
};

exports.slide = function(req, res) {
    res.render('slider/slide', {
        title: 'Slide',
        slides: req.params.slides,
        slide: req.params.slide,
        editMode: req.query.edit
    });
};

exports.trainer = function(req, res) {
    res.render('slider/trainer', {
        title: "Trainer's Screen",
        slides: req.params.slides
    });
};
