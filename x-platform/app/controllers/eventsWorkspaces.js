var _ = require('lodash'),
  Q = require('q'),
  logger = require('../../config/logging'),
  Slidesaves = require('../models/slidesave'),
  States = require('../services/states');

var onError = function(res) {
  return function(err) {
    logger.error(err);
    res.sendStatus(400);
  };
};

var onDone = function() {};

var EventsWorkspaces = {

  getForEvent: function(req, res) {
    var eventId = req.params.eventId;

    Q.when(Slidesaves.find({
      events: eventId
    }).populate('user').lean().exec()).then(function(saves) {
      res.send(saves);
    }).fail(onError(res)).done(onDone);
  }

};


module.exports = EventsWorkspaces;
