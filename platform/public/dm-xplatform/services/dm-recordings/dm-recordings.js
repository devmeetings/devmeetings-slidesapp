define(['angular', 'xplatform/xplatform-app'], function (angular, xplatformApp) {
    xplatformApp.service('dmRecordings', ['$http', '$q', function ($http, $q) {
        var recordings = {
        };
      
        var TransformedRecording = function (options) {
            this.slides = options.slides;
        };

        var transform = function (data) {
            return new TransformedRecording({
                slides: data.slides
            });
        };

        return {
            getRecording: function (recording) {
                var result = recordings[recording];

                if (result) {
                    return result.promise;
                }

                result = $q.defer();
                recordings[recording] = result;

                $http.get('/api/recordings/' + recording).then(function (data) {
                    result.resolve(transform(data.data)); 
                }, function () {
                    result.reject(); 
                });

                return result.promise;
            }
        };
    }]);
});
