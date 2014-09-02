define(['angular', 'xplatform/xplatform-app'], function (angular, xplatformApp) {
    xplatformApp.service('dmTasks', ['$http', '$q', function ($http, $q) {
        var result;
            
        return {
            getEventWithTask: function (event, task, force) {
                if (result && !force) {
                    return result.promise;
                }
                
                result = $q.defer();
                $http.get('/api/eventWithTask/' + event + '/' + task).success(function (data) {
                    result.resolve(data);
                });

                return result.promise;
            }
        };
    }]);
});
