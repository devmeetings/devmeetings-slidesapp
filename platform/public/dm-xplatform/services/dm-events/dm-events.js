define(['angular', 'xplatform/xplatform-app'], function (angular, xplatformApp) {
    xplatformApp.service('dmEvents', ['$http', '$q', function ($http, $q) {
   
        var promises = {
        };
        
        var states = {
        };
        
        return {
            allEvents: function () {
                var result = $q.defer();
                $http.get('/api/events').then(function (data) {
                    result.resolve(data.data);
                }, function () {
                    result.reject();
                });

                return result.promise;
            },
            getEvent: function (event, download) {
                var result = promises[event];

                if (!result || download) {
                    result = $q.defer();
                    promises[event] = result;
                }

                if (!download) {
                    return result.promise;
                }

                $http.get('/api/events/' + event).then(function (data) {
                    result.resolve(data.data);
                }, function () {
                    result.reject();
                });

                return result.promise;
            },
            getState: function (event, id) {
                var key = event + 'index' + id;
                if (!states[key]) {
                    states[key] = {};
                }
                return states[key];
            },
            changeEventVisibility: function (event, visible) {
                $http.post('/api/change_event_visibility/' + event + '/' + visible);
            }
        };
    }]);
});

