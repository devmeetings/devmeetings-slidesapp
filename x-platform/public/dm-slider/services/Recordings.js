define(['slider/slider.plugins'], function (sliderPlugins) {
  sliderPlugins.factory('Recordings', ['$http',
    function ($http) {
      var Recordings = {
        getRecordings: function () {
          return $http.get('api/recordings');
        },
        getRecordingWithId: function (id) {
          return $http.get('api/recordings/' + id);
        }
      };

      return Recordings;
    }
  ]);
});
