define(['angular', 'xplatform/xplatform-app', '_'], function (angular, xplatformApp, _) {
    xplatformApp.controller('dmXplatformRanking', ['$scope', '$stateParams', 'dmEvents', function ($scope, $stateParams, dmEvents) {

        $scope.personDidTask = function (person, task) {
            return !!person.tasks[task._id];
        };

        $scope.personIterationCount = function (person, iteration) {
            return _.reduce(iteration.tasks, function (result, task) {
                return result + $scope.personDidTask(person, task);
            }, 0);
        };

        var lastAvailableIteration = function (event) {
            return _.findLastIndex(event.iterations, function (iter) {
                return iter.status === 'available'
            });
        };

        dmEvents.getEvent($stateParams.event, false).then(function (data) {
            $scope.event = data;
            $scope.ranking = data.ranking;
            $scope.activeIteration = lastAvailableIteration(data);
        });
    }]);
    xplatformApp.filter('keysLength', function() {
        return function (input, exp) {
            if (!input) {
                return 0;
            }
            if (exp) {
                return _.sortBy(input, function (i) {
                    return Object.keys(i[exp]).length;
                });
            }
            return Object.keys(input).length;
        };
    });
});

