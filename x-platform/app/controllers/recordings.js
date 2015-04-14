var RecordingModel = require('../models/recording');
var states = require('../services/states');
var _ = require('lodash');
var autoAnnotations = require('../services/autoAnnotations');


function convertRecordingToUnifiedHistoryFormat(recording, filter) {
  'use strict';

  var slideStates = recording.slides;
  delete recording.slides;

  recording.original = slideStates[0].original;
  recording.patches = slideStates.reduce(function(patches, state) {

    var timeDiff = (_.last(patches) || {}).timestamp || 0;
    state.patches.map(function(patch) {
      patch.timestamp += timeDiff;
    });

    // Apply current
    state.patches[0].current = state.original;

    // Udate patches
    return patches.concat(state.patches);
  }, []);

  // [ToDr] Not sure why some old recordings have timestamp 0 at the end
  var len = recording.patches.length;
  if (len > 1 && recording.patches[len - 1].timestamp === 0) {
    recording.patches[len - 1].timestamp = recording.patches[len - 2].timestamp + 1;
  }

  if (filter) {
    recording.patches = recording.patches.filter(function(val, idx) {
      return idx % filter === 0;
    });
  }

  // Skip silence
  states.skipSilence(recording.patches);

  return recording;
}


var recordingsFilter = 2;

var Recordings = {
  list: function(req, res) {
    RecordingModel.find({}).select('_id title group date').lean().exec(function(err, recordings) {
      if (err) {
        console.error(err);
        res.send(404, err);
        return;
      }
      res.send(recordings);
    });
  },

  get: function(req, res) {
    RecordingModel.findOne({
      _id: req.params.id
    }).lean().exec(function(err, recording) {
      if (err || !recording) {
        console.error(err);
        res.send(404, err);
        return;
      }
      var rec = convertRecordingToUnifiedHistoryFormat(recording, recordingsFilter);
      res.setHeader('Cache-Control', 'public, max-age=' + 3600 * 24 * 7);
      res.send(rec);
    });
  },

  autoAnnotations: function(req, res) {
    var format = req.query.format;

    RecordingModel.findOne({
      _id: req.params.id
    }).lean().exec(function(err, rawRecording) {
      if (err) {
        console.error(err);
        res.status(404).send(err);
        return;
      }

      if (!rawRecording || rawRecording.slides.length === 0) {
        res.send([]);
        return;
      }

      var recording = convertRecordingToUnifiedHistoryFormat(rawRecording, recordingsFilter + 1);

      var annotations = autoAnnotations(recording);

      if (format === 'yaml') {
        var yaml = require('js-yaml');
        res.header('Content-Type', 'application/yaml');
        res.send(yaml.safeDump({
          annotations: annotations
        }));
        return;
      }
      res.send(annotations);

    });
  }
};

module.exports = Recordings;
