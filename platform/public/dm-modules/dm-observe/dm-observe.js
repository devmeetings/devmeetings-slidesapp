define(['angular'], function(angular) {
    'use strict'
    angular.module('dm-observe', []).factory('dmObserve', ['$http', '$q',
        function($http, $q) {
            var data = {};
            var result;
            var pending = {};


            var resolveCanBeObserved = function(value, key) {
                var single = _.find(data.result.observed, function(observed) {
                    return observed.userId === key;
                });

                value.resolve(single === undefined);
            };

            return {
                getObserved: function() {
                    if (result) {
                        return result.promise;
                    }

                    result = $q.defer();
                    $http.get('/api/observes').success(function(observe) {
                        data.result = observe;
                        result.resolve(data);
                        _.forEach(pending, function(value, key) {
                            resolveCanBeObserved(value, key);
                        });
                        pending = {};

                    });
                    return result.promise;
                },
                canBeObserved: function(id) {
                    if (pending[id]) {
                        return pending[id].promise;
                    }

                    var can = $q.defer();
                    if (!result) {
                        pending[id] = can;
                        this.getObserved();
                        return can.promise;
                    }

                    resolveCanBeObserved(can, id);
                    return can.promise;
                },
                observe: function(id, name, avatar) {
                    $http.post('/api/observes', {
                        id: id
                    });
                    data.result.observed.push({
                        userId: id,
                        name: name,
                        avatar: avatar
                    });
                },
                unobserve: function(id) {
                    $http.delete('/api/observes/' + id);
                    var index = _.findIndex(data.result.observed, function(observed) {
                        return observed.userId === id;
                    });

                    if (index === -1) {
                        return;
                    }

                    data.result.observed.splice(index, 1);
                }
            }
        }
    ]);
});