define(['angular', 'dm-xplatform/xplatform-app', '_'], function(angular, xplatformApp, _) {
    xplatformApp.service('dmSlides', ['$http', '$q', '$window',
        function($http, $q, $window) {

            function wrap(promise) {
                var res = $q.defer();
                promise.then(function(d) {
                    res.resolve(d);
                }, function(err) {
                    res.reject(err);
                });
                return res.promise;
            }

        	return {
                getSlide: function(slideId) {
                    return wrap($http.get('/api/slides/' + slideId));
                }
            };
        }]);
});
