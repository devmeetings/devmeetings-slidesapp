define(['angular', 'dm-xplayer/dm-xplayer-app'], function(angular, xplayerApp) {
  'use strict';

  xplayerApp.service('dmRecordings', ['$http', '$q', function($http, $q) {
    var recordings = {};

    var TransformedRecording = function(options) {
      this.slides = options.slides;
      this.layout = options.layout;
    };

    var transform = function(data) {
      return new TransformedRecording({
        slides: data.slides,
        layout: data.layout
      });
    };

    return {

      getList: function() {
        return $q.when($http.get('/api/recordings'));
      },

      getAutoAnnotations: function(recordingId) {
        return $http.get('/api/recordings/' + recordingId + '/annotations').then(function(data) {
          return data.data;
        });
      },

      getRecording: function(recording) {
        var result = recordings[recording];

        if (result) {
          return result.promise;
        }

        result = $q.defer();
        recordings[recording] = result;

        $http.get('/api/recordings/' + recording).then(function(data) {
          result.resolve(transform(data.data));
        }, function() {
          result.reject();
        });

        return result.promise;
      }

    };
  }]);
});
