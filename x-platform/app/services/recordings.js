var Q = require('q');
var Events = require('../models/event');
var Recordings = require('../models/recording');


module.exports = {

  createRecordingForEvent: function(eventId, slides) {
    'use strict';
    return Q.when(Events.findById(eventId).exec()).then(function(event) {

      var recordingNo = event.iterations[0].materials.length + 1;
      var recording = {
        title: 'Movie ' + recordingNo,
        group: event.name,
        date: new Date(),
        slides: slides
      };

      return Q.when(Recordings.create(recording)).then(function(rec) {
        event.iterations[0].materials.push({
          title: recording.title,
          material: rec._id
        });

        return event.save();
      });
    });
  }

};
