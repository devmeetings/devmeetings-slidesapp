var Q = require('q');
var _ = require('lodash');
var Events = require('../models/event');
var Recordings = require('../models/recording');

module.exports = {

  fixIds: function (recordingId) {
    'use strict';

    var that = this;
    return Q.when(
      Recordings.findById(recordingId).exec()
    ).then(function (recording) {
      that._fixIdsForRecording(recording);
      return recording.save();
    });
  },

  _fixIdsForRecording: function (rec) {
    'use strict';

    rec.slides.map(function (slide, slideIdx) {
      slide.patches.map(function (patch, patchIdx) {
        var id = 'r' + rec._id + '_' + slideIdx + '_' + patchIdx;
        patch.id = id;
      });
    });
    rec.markModified('slides');
  },

  createRecordingForEvent: function (eventId, slides) {
    'use strict';

    var that = this;
    return Q.when(Events.findById(eventId).exec()).then(function (event) {
      var recordingNo = event.iterations[0].materials.length + 1;
      var recording = {
        title: 'Movie ' + recordingNo,
        group: event.name,
        date: new Date(),
        slides: slides
      };

      return Q.when(Recordings.create(recording)).then(function (rec) {
        // Fix ids of patches
        that._fixIdsForRecording(rec);

        return Q.when(rec.save()).then(function () {
          event.iterations[0].materials.push({
            title: recording.title,
            material: rec._id
          });

          return event.save();
        });
      });
    });
  },

  joinRecordings: function (recId1, recId2) {
    return Q.all([
      Q.when(Recordings.findById(recId1).lean().exec()),
      Q.when(Recordings.findById(recId2).lean().exec())
    ]).then(function (recordings) {
      var rec1 = recordings[0];
      var rec2 = recordings[1];

      // add one patch between rec2 i rec1
      var lastSlide = _.last(rec1.slides);
      var firstSlide = _.first(rec2.slides);

      // Circular dependencies!
      var States = require('./states');
      var patch = States.generatePatch(lastSlide.current, firstSlide.original);

      lastSlide.current = firstSlide.original;
      var lastPatch = _.last(lastSlide.patches);
      var lastPatchId = lastPatch.id.split('_');
      lastPatchId[1] = parseInt(lastPatchId[1], 10) + 1;

      lastSlide.noOfPatches++;
      lastSlide.patches.push({
        id: lastPatchId.join('_'),
        timestamp: lastPatch.timestamp + 1,
        patch: patch
      });

      // We are going to create new recording
      return Q.when(Recordings.create({
        title: rec1.title + ', ' + rec2.title,
        group: rec1.group,
        playbackRate: rec1.playbackRate,
        layout: rec1.layout,
        date: rec1.date,
        slides: rec1.slides.concat(rec2.slides)
      }));
    });
  }

};
