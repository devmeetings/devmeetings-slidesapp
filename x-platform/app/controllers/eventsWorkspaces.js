var _ = require('lodash'),
  Q = require('q'),
  mongoose = require('mongoose'),
  Slidesaves = require('../models/slidesave'),
  States = require('../services/states');

var onError = function(res) {
  return function(err) {
    console.error(err);
    res.send(400);
  };
};

var onDone = function() {};

var EventsWorkspaces = {

  getForEvent: function(req, res) {
    var eventId = req.params.eventId;

    Q.ninvoke(Slidesaves.find({
      events: eventId
    }).populate('user').lean(), 'exec').then(function(saves) {
      res.send(saves);
    }).fail(onError(res)).done(onDone);
  }

};


module.exports = EventsWorkspaces;
