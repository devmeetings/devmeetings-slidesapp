'use strict'
angular.module('dm-user', []).factory('dmUser', ['$http', '$q', function ($http, $q) {
    var cache = {};

    return {
        getUserWithId: function (id) {
            if (cache[id]) {
                return cache[id].promise;
            }
    
            var result = $q.defer();
            cache[id] = result;
            $http.get('/api/users/' + id).success(function (user) {
                result.resolve(user);
            });
            
            return result.promise;
        }
    };
}]);
