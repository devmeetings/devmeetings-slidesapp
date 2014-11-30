define(['angular'], function(angular) {
    'use strict'
    angular.module('dm-stream', []).factory('dmStream', ['$http', '$q',
        function($http, $q) {
            var data = {};
            var result;
            var needUpdate = false;

            return {
                getStream: function() {
                    if (result && needUpdate === false) {
                        return result.promise;
                    }

                    result = $q.defer();
                    $http.get('/api/streams').success(function(stream) {
                        data.result = stream;
                        needUpdate = false;
                        result.resolve(data);
                    });
                    return result.promise;
                },
                getUserStream: function(id) {
                    var ustream = $q.defer();
                    $http.get('/api/streams/' + id).success(function(stream) {
                        ustream.resolve({
                            result: stream
                        });
                    });
                    return ustream.promise;
                },
                markNeedUpdate: function() {
                    needUpdate = true;
                }
            };
        }
    ]);
});
