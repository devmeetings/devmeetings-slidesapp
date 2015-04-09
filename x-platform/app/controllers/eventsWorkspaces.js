var _ = require('lodash'),
  Q = require('q'),
  mongoose = require('mongoose'),
  Slidesaves = require('../models/slidesave'),
  States = require('../services/states'),
  Recordings = require('../models/recording');

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

  convertToRecording: function(req, res) {
    'use strict';

    var userName = req.body.userName || 'no-user';
    var eventName = req.body.eventName || 'no-event';

    var userId = req.params.userId;
    findWorkspaces(15000, userId, res, function(workspaces) {

      // We need to convert workspace into slide
      var slides = workspaces.map(function(ws) {
        return {
          lastAccessTime: ws.time,
          timestamp: ws.time,
          code: ws 
        };
      });

      // Split recordings
      var promises = slides.reduce(function(parts, slide) {
        var currentPart = parts[parts.length - 1];
        // break by size
        if (currentPart.length > 250) {
          currentPart = [];
          parts.push(currentPart);
        }

        currentPart.push(slide);
        return parts;
      }, [
        []
      ]).map(function(slidesPart, key) {
        
        var firstTime = slidesPart[0].timestamp;

        slidesPart = slidesPart.map(function(slide) {
          slide.timestamp -= firstTime;
          return slide;
        });

        return Q.ninvoke(Recordings, 'create', {
          title: userName + ' (' + eventName + ') [' + (key + 1) + ']',
          group: userName + ' - ' + eventName,
          date: slidesPart[0].lastAccessTime,
          slides: slidesPart
        });
      });

      Q.all(promises).then(function(rec) {
        res.send({
          recordingId: rec[0]._id
        });
      }, function(err) {
        console.error(err);
        res.send(400, err);
      });

    });
  }

};


module.exports = EventsWorkspaces;
