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


function findWorkspaces(limit, userId, res, callback) {
  States.findForUser(userId, limit).then(function(states) {

    return states.map(function(st) {
      st.current.time = st.currentTimestamp;
      return st.current;
    });

  }).then(callback).fail(onError(res)).done(onDone);
}

var EventsWorkspaces = {

  getForEvent: function(req, res) {
    var eventId = req.params.eventId;

    Q.ninvoke(Slidesaves.find({
      event: eventId
    }).populate('user').lean(), 'exec').then(function(saves) {
      res.send(saves);
    }).fail(onError(res)).done(onDone);
  },

  getPages: function(req, res) {
    var userId = req.params.userId;

    findWorkspaces(50, userId, res, function(saves) {
      res.send(saves.map(function(st) {
        return st.workspace;
      }));
    });
  },

};


module.exports = EventsWorkspaces;
