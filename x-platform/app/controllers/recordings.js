var RecordingModel = require('../models/recording');
var states = require('../services/states');
var _ = require('lodash');
var autoAnnotations = require('../services/autoAnnotations');
var yamlReply = require('../services/yaml');
var logger = require('../../config/logging');


function convertRecordingToUnifiedHistoryFormat(recording) {
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

  // Skip silence
  states.skipSilence(recording.patches);

  return recording;
}

function findRecording(id) {
  'use strict';

  return RecordingModel.findOne({
    _id: id
  }).select('original current _id layout playbackRate slides.patches slides.original').lean();
}

var Recordings = {
  list: function(req, res) {
    RecordingModel.find({}).select('_id title group date').lean().exec(function(err, recordings) {
      if (err) {
        logger.error(err);
        res.send(404, err);
        return;
      }
      res.send(recordings);
    });
  },

  get: function(req, res) {
    findRecording(req.params.id).exec(function(err, recording) {
      if (err || !recording) {
        logger.error(err);
        res.status(404).send(err);
        return;
      }
      var rec = convertRecordingToUnifiedHistoryFormat(recording);
      res.setHeader('Cache-Control', 'public, max-age=' + 3600 * 24 * 7);
      res.send(rec);
    });
  },

  autoAnnotations: function(req, res) {
    findRecording(req.params.id).exec(function(err, rawRecording) {

      if (err) {
        logger.error(err);
        res.status(404).send(err);
        return;
      }

      if (!rawRecording || rawRecording.slides.length === 0) {
        res.send([]);
        return;
      }

      var recording = convertRecordingToUnifiedHistoryFormat(rawRecording);
      recording.cacheKey = 'annotations_' + rawRecording._id;
      autoAnnotations(recording).done(function(annotations) {
        yamlReply(req, res, annotations, function(anno) {
          return {
            annotations: anno
          };
        });
      });
    });
  }
};

module.exports = Recordings;
