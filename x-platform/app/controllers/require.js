var DeckModel = require('../models/deck');
var SlideModel = require('../models/slide');
var Slides = require('../services/slides');

var _ = require('lodash');

// TODO [ToDr] Deprecated! Update Frontend to call normal API instead of this.
// @see DeckAndSlides asPromise

var sendAsRequireJSModule = function (object, res) {
  res.set('Content-Type', 'application/javascript');
  var data = (_.isArray(object) ? 'define([],' : 'define(') + JSON.stringify(object) + ');';
  res.send(data);
};

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
      sendAsRequireJSModule(slides.sort(function (a, b) {
        var aIdx = deck.slides.indexOf(a._id);
        var bIdx = deck.slides.indexOf(b._id);
        return aIdx - bIdx;
      }), res);
    });
  });
};

exports.getDeck = function (req, res) {
  DeckModel.findById(req.params.id, function (err, deck) {
    if (err) {
      res.status(404).send(err);
      return;
    }
    sendAsRequireJSModule(deck, res);
  });
};

exports.getSlide = function (req, res) {
  Slides.findSlide(req.params.id).then(function (slide) {
    sendAsRequireJSModule(slide, res);
  }, function (err) {
    res.send(404, err);
  });
};
