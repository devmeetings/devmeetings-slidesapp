define(['angular', 'xplatform/xplatform-app'], function (angular, xplatformApp) {
    xplatformApp.service('dmTasks', ['$http', '$q', function ($http, $q) {
        var result;
            
        return {
            getEventWithSlide: function (event, slide, force) {
                if (result && !force) {
                    return result.promise;
                }
                
                result = $q.defer();
                $http.get('/api/event_with_slide/' + event + '/' + slide).success(function (data) {
                    result.resolve(data);
                });

                return result.promise;
            }
        };
    }]);
});
