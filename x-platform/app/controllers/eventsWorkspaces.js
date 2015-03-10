var _ = require('lodash'),
  Q = require('q'),
  mongoose = require('mongoose'),
  Slidesaves = require('../models/slidesave'),
  Workspaces = require('../models/workspace'),
  Recordings = require('../models/recording');

var onError = function(res) {
  return function(err) {
    console.error(err);
    res.send(400);
  };
};

var onDone = function() {};


function findWorkspaces(limit, userId, res, callback) {
  Q.ninvoke(Workspaces.find({
    authorId: userId
  }).sort({
    _id: -1
  }).limit(limit).lean(), 'exec').then(callback).fail(onError(res)).done(onDone);
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
      res.send(saves);
    });
  },

  getTimeline: function(req, res) {
    var userId = req.params.userId;

    Q.ninvoke(Workspaces.find({
      authorId: userId
    }, {
      hash: 1,
      lastAccessTime: 1,
      files: 1
    }).sort({
      _id: 1
    }).lean(), 'exec').then(function(workspaces) {
      var ws = workspaces.filter(function(x, idx) {
        return idx % 4 === 0;
      }).map(function(workspace) {
        workspace.createTime = new mongoose.Types.ObjectId(workspace._id).getTimestamp();

        var fileNames = Object.keys(workspace.files);
        workspace.files = fileNames.reduce(function(memo, key) {
          var val = workspace.files[key];
          var keys = key.split('|');
          var type = keys[keys.length - 1];

          memo[type] = memo[type] || 0;
          memo[type] += val.length;
          return memo;
        }, {});

        workspace.fileNames = fileNames;
        return workspace;
      });
      res.send(ws);
    }).fail(onError(res)).done(onDone);
  },

  convertToRecording: function(req, res) {
    'use strict';

    var userName = req.body.userName || "no-user";
    var eventName = req.body.eventName || "no-event";

    var userId = req.params.userId;
    findWorkspaces(15000, userId, res, function(workspaces) {

      function guessActiveTab(prev, cur) {
        if (!prev) {
          return Object.keys(cur.files)[0];
        }

        return _.reduce(prev.files, function(active, val, key) {
          
          if (val !== cur.files[key]) {
            return key;
          }

          return active;

        }, false);
      }

      workspaces = workspaces.reverse().filter(function(val, key) {
        return key % 3;
      });

      // We need to convert workspace into slide
      var slides = workspaces.map(function(ws, idx) {
        var previous = workspaces[idx - 1];
        var activeTab = guessActiveTab(previous, ws);
        var slide = {
          'workspace': {
            'active': activeTab,
            'size': 'xxl',
            'tabs': _.mapValues(ws.files, function(content) {
              return {
                'content': content
              };
            })
          }
        };

        return {
          lastAccessTime: ws.lastAccessTime,
          code: slide
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
      }, [[]]).map(function(slidesPart, key) {
        
        slidesPart = slidesPart.map(function(slide, key) {
          //TODO [ToDr] Take real values from somewhere?
          slide.timestamp = key * 200;
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
