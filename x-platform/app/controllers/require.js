var DeckModel = require('../models/deck');
var SlideModel = require('../models/slide');
var Slides = require('../services/slides');

exports.getDeckSlides = function (req, res) {
  DeckModel.findById(req.params.id, function (err, deck) {
    if (err) {
      console.error(err);
      res.status(404).send(err);
      return;
    }

    SlideModel.find({
      '_id': {
        $in: deck.slides
      }
    }, function (err, slides) {
      if (err) {
        console.error(err);
        res.send(404, err);
        return;
      }

      res.send(slides.sort(function (a, b) {
        var aIdx = deck.slides.indexOf(a._id);
        var bIdx = deck.slides.indexOf(b._id);
        return aIdx - bIdx;
      }));
    });
  });
};

exports.getDeck = function (req, res) {
  DeckModel.findById(req.params.id, function (err, deck) {
    if (err) {
      res.status(404).send(err);
      return;
    }
    res.send(deck);
  });
};

exports.getSlide = function (req, res) {
  Slides.findSlide(req.params.id).then(function (slide) {
    res.send(slide);
  }, function (err) {
    res.send(404, err);
  });
};
