define(['angular', 'xplatform/xplatform-app'], function(angular, xplatformApp) {
    xplatformApp.service('dmWorkspaces', ['$http', '$q',
        function($http, $q) {
            function wrap(promise) {
                var res = $q.defer();
                promise.then(function(d) {
                    res.resolve(d.data);
                }, function(err) {
                    res.reject(err);
                });
                return res.promise;
            }

            return {
                getUsersWorkspaces: function(baseSlide) {
                    return wrap($http.get('/api/workspaces/' + baseSlide));
                },
                getUserAllPages: function(userId) {
                    return wrap($http.get('/api/workspaces/users/' + userId));
                },
                getUserTimeline: function(userId) {
                    return wrap($http.get('/api/workspaces/users/' + userId + '/timeline'));
                }
            };
        }
    ]);
});
