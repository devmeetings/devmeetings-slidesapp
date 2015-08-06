var Events = require('../models/event');
var Slides = require('../models/slide');
var Decks = require('../models/deck');
var Q = require('q');
var _ = require('lodash');
var logger = require('../../config/logging');
var Annotations = require('../models/annotations');
var parser = require('../services/event-parser');

exports.createEventFromZip = function (req, res) {
  'use strict';
  var zip = req.files.file.path;

  parser.fetchAndParse(zip, function (err, events) {
    if (err) {
      return res.status(400).send(err);
    }

    if (!_.isArray(events)) {
      events = [events];
    }

    var cache = {};

    events.reduce(function (previous, event) {
      // Create all related entities
      return previous.then(function (arr) {
        return Q.all(event.iterations.map(function (it) {
          return Q.all(it.materials.map(function (mat) {
            var createBaseSlide = createEntityIfNeeded(mat, 'baseSlide', Slides, cache);
            var createIntro = createEntityIfNeeded(mat, 'intro', Slides, cache);
            var createAnnotations = createEntityIfNeeded(mat, 'annotations', Annotations, cache);
            var createDeck = createDeckIfNeeded(mat, cache);

            return Q.all([createBaseSlide, createIntro, createAnnotations, createDeck]);
          }));
        })).then(function () {
          return arr.concat(event);
        });
      });
    }, Q.resolve([])).then(function (events) {
      return Q.all(events.map(function (event) {
        var defer = Q.defer();

        Events.update({
          name: event.name
        }, {
          $set: {
            name: event.name + '_' + new Date(),
            removed: true
          }
        }, function () {
          var ev = new Events(event);
          ev.save(function (err) {
            if (err) {
              return defer.reject(err);
            }

            return defer.resolve(ev);
          });

        });

        return defer.promise;
      }));
    }).done(function (events) {
      res.redirect('/space/' + events[0]._id + '/learn/agenda');
    }, function (err) {
      logger.error(err);
      res.send(400, err);
    });
  });

};

function createEntityIfNeeded (obj, name, Entit, cache) {
  'use strict';
  if (!obj[name]) {
    return Q.when();
  }

  // No need to create anything
  if (typeof obj[name] === 'string') {
    return Q.when();
  }

  var promise;
  if (cache[obj[name]]) {
    promise = cache[obj[name]];
  } else {
    promise = Q.when(Entit.create(obj[name])).then(function (e) {
      return e._id.toString();
    });
  }

  promise.then(function (_id) {
    obj[name] = _id;
  });

  return promise;
}

function createDeckIfNeeded (obj, cache) {
  'use strict';

  if (!obj.deck || !obj.deck.deck) {
    return Q.when();
  }

  if (typeof obj.deck.deck === 'string') {
    return Q.when();
  }

  var deck = obj.deck.deck;
  return Q.all(deck.slides.map(function (slide, slideIdx) {
    return createEntityIfNeeded(deck.slides, slideIdx, Slides, cache);
  })).then(function () {
    // All slides created. Let's create deck
    return createEntityIfNeeded(obj.deck, 'deck', Decks, cache);
  });
}
