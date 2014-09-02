define(['angular', 
        '_',
        'xplatform/xplatform-app',
        'directives/plugins-loader',
        'xplatform/directives/dm-microtask-users/dm-microtask-users',
        'xplatform/directives/dm-microtask-done/dm-microtask-done'
        ], function (angular, _, xplatformApp, pluginsLoader) {
    xplatformApp.controller('dmXplatformSlide', ['$scope', '$stateParams', '$state', '$http', '$timeout', 'dmUser', function ($scope, $stateParams, $state, $http, $timeout, dmUser) {
        $http.get('/api/eventWithTask/' + $stateParams.event + '/' + $stateParams.task).success(function (event) {
            var result = _.find(event.slides, function (task) {
                return task.task === $stateParams.task;
            });

            $scope.slide = result.slideId;
            $timeout(function () {
                $scope.$broadcast('dm-xplatform-task-people', result.peopleFinished);
            }, 1000);
        });
    }]);
});
