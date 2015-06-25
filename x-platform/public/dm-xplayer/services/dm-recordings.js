define(['_', 'angular', 'dm-xplayer/dm-xplayer-app'], function (_, angular, xplayerApp) {
  'use strict';

  xplayerApp.service('dmRecordings', function ($http, $q, dmPlayer) {
    var recordings = {};

    return {
      getList: function () {
        return $q.when($http.get('/api/recordings'));
      },

      getAutoAnnotations: function (recordingId) {
        return $http.get('/api/recordings/' + recordingId + '/annotations').then(function (data) {
          return data.data;
        });
      },

      preparePlayerForRecording: function (dmRecorder, recordingId) {
        return this.getRecording(recordingId).then(function (recording) {
          var current = JSON.parse(JSON.stringify(recording.original || {}));
          var player = dmPlayer.createPlayerSource(dmRecorder, recording.patches[0].id, current);
          var rec = {
            player: player,
            patches: recording.patches,
            original: recording
          };
          var max = _.last(recording.patches).timestamp / 1000;

          return {
            recording: rec,
            max: max
          };
        });
      },

      getRecording: function (recording) {
        var result = recordings[recording];

        if (result) {
          return result;
        }

        result = $http.get('/api/recordings/' + recording).then(function (data) {
          return data.data;
        });
        recordings[recording] = result;
        return result;
      }

    };
  });
});
