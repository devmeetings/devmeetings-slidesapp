var Events = require('../models/event'),
  Slides = require('../models/slide'),
  Decks = require('../models/deck'),
  Q = require('q'),
  Annotations = require('../models/annotations'),
  parser = require('../services/event-parser');



exports.createEventFromZip = function(req, res) {
  'use strict';

  var zip = req.query.zip;
  if (!zip) {
    return res.send(400, 'Missing zip file');
  }

  var shouldRemoveEvent = false;

  parser.fetchAndParse(zip, function(err, event) {
    if (err) {
      return res.send(400, 'Problem while fetching / parsing:' + err);
    }

    // Create all related entities
    Q.all(event.iterations.map(function(it) {
      return Q.all(it.materials.map(function(mat) {
        var createBaseSlide = createEntityIfNeeded(mat, 'baseSlide', Slides);
        var createIntro = createEntityIfNeeded(mat, 'intro', Slides);
        var createAnnotations = createEntityIfNeeded(mat, 'annotations', Annotations);
        var createDeck = createDeckIfNeeded(mat);

        return Q.all([createBaseSlide, createIntro, createAnnotations, createDeck]);
      }));
    })).then(function() {

      Events.update({
        name: event.name
      }, {
        $set: {
          name: event.name + '_' + new Date(),
          removed: true
        }
      }, function() {
        
        var ev = new Events(event);
        ev.save(function(err, ok) {
          if (err) {
            return res.send(400, err);
          }

          return res.send(ok);
        });

      });

    });
  });

};



function createEntityIfNeeded(obj, name, Entit) {
  'use strict';
  if (!obj[name]) {
    return Q.when();
  }

  // No need to create anything
  if (typeof obj[name] === 'string') {
    return Q.when();
  }


  return Q.ninvoke(Entit, 'create', obj[name]).then(function(e) {
    obj[name] = e._id;
  });
}


function createDeckIfNeeded(obj) {
  'use strict';

  if (!obj.deck || !obj.deck.deck) {
    return Q.when();
  }

  if (typeof obj.deck.deck === 'string') {
    return Q.when();
  }


  var deck = obj.deck.deck;
  return Q.all(deck.slides.map(function(slide, slideIdx) {
    return createEntityIfNeeded(deck.slides, slideIdx, Slides);
  })).then(function() {
    // All slides created. Let's create deck
    return createEntityIfNeeded(obj.deck, 'deck', Decks);
  });
}
