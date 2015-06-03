var Q = require('q'),
  Decks = require('../../models/deck'),
  Slides = require('../../models/slide'),
  Events = require('../../models/event');

exports.initApi = function(router, authenticated, app, router2) {
  'use strict';

  function search(id, res, collection, link, postFix, next) {
    Q.when(collection.findOne({
      name: id
    }).lean().exec()).done(function(x) {
      if (x) {
        res.redirect(link + '/' + x._id + postFix);
      } else {
        next();
      }
    });
  }

  router2.get('/-:id', function(req, res) {

    var id = req.params.id;
    var searchFor = search.bind(null, id, res);

    var notFound = function() {
      res.send(404, 'Not Found');
    };
    var searchSlides = searchFor.bind(null, Slides, '/slides', '', notFound);
    var searchDecks = searchFor.bind(null, Decks, '/decks', '', searchSlides);
    var searchEvents = searchFor.bind(null, Events, '/space', '/learn/agenda', searchDecks);

  
    searchEvents();
  });
};
