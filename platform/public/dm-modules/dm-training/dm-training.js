define(['angular'], function(angular) {
    'use strict'
    angular.module('dm-training', []).factory('dmTrainings', ['$http', '$q',
        function($http, $q) {

            var trainings = [];

            var getTrainings = function() {
                return $http.get('/api/trainings').success(function(res) {
                    trainings = res;
                    return trainings;
                });
            };

            var getTrainingWithId = function(id) {
                var result = $q.defer();
                var training = _.find(trainings, {
                    _id: id
                });
                if (training !== undefined) {
                    result.resolve(training);
                    return result.promise;
                }

                $http.get('/api/trainings/' + id).success(function(res) {
                    if (_.find(trainings, {
                        _id: id
                    }) === undefined) {
                        trainings.push(res);
                    }
                    result.resolve(res);
                });

                return result.promise;

            };

            var addTraining = function(title) {
                var result = $q.defer();

                return $http.post('/api/trainings', {
                    title: title
                }).success(function(res) {
                    if (_.find(trainings, {
                        _id: res.id
                    }) === undefined) {
                        trainings.push(res);
                    }
                });
            };

            var putTraining = function(training) {
                var index = _.findIndex(trainings, function(elem) {
                    return elem._id === training._id;
                });
                if (index === -1) {
                    trainings.push(training);
                } else {
                    trainings[index] = training;
                }

                return $http.put('/api/trainings/' + training._id, angular.copy(training));
            };

            var Trainings = {
                getTrainings: getTrainings,
                addTraining: addTraining,
                getTrainingWithId: getTrainingWithId,
                putTraining: putTraining
            };

            return Trainings;
        }
    ]);

});