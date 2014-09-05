define(['angular', 
        '_',
        'xplatform/xplatform-app',
        'directives/plugins-loader',
        'xplatform/directives/dm-microtask-users/dm-microtask-users',
        'xplatform/directives/dm-microtask-done/dm-microtask-done',
        'xplatform/services/dm-tasks/dm-tasks'
        ], function (angular, _, xplatformApp, pluginsLoader) {
    xplatformApp.controller('dmXplatformSlide', ['$scope', '$stateParams', '$state', '$http', '$timeout', 'dmUser', 'dmTasks', function ($scope, $stateParams, $state, $http, $timeout, dmUser, dmTasks) {
        var existingSlide = localStorage[$stateParams.slide];
        if (existingSlide) {
            $scope.slide = JSON.parse(existingSlide);
        }

        dmTasks.getEventWithSlide($stateParams.event, $stateParams.slide, true).then(function (event) {
            var result = _.find(event.slides, function (task) {
                return task.slideId._id === $stateParams.slide;
            });

            if (!existingSlide) {
                $scope.slide = result.slideId;
            }
        });

        $scope.$watch('slide', function () {
            if ($scope.slide) {
                localStorage[$stateParams.slide] = JSON.stringify($scope.slide);
            }
        }, true);
    
        $scope.saves = [];
        $http.get('/api/slidesaves/' + $stateParams.event + '/' + $stateParams.slide).then(function (data) {
            $scope.saves = data.data.map(function (save) {
                save.timestamp = new Date(save.timestamp);
                return save;
            });
        });

        $scope.saveSlide = function () {
            var save = {
                slide: angular.copy($scope.slide),
                timestamp: new Date(),
                title: $scope.saveTitle,
                event: $stateParams.event
            };

            $scope.saves.push(save);
            $http.post('/api/slidesaves', save);

            $scope.saveTitle = '';
        };

        $scope.openSave = function (save) {
            $scope.slide = save.slide;
        };

    }]);
});

