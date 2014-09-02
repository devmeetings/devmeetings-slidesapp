define(['angular', 
        '_',
        'xplatform/xplatform-app',
        'directives/plugins-loader',
        'xplatform/directives/dm-microtask-users/dm-microtask-users',
        'xplatform/directives/dm-microtask-done/dm-microtask-done',
        'xplatform/services/dm-tasks/dm-tasks'
        ], function (angular, _, xplatformApp, pluginsLoader) {
    xplatformApp.controller('dmXplatformSlide', ['$scope', '$stateParams', '$state', '$http', '$timeout', 'dmUser', 'dmTasks', function ($scope, $stateParams, $state, $http, $timeout, dmUser, dmTasks) {
        dmTasks.getEventWithSlide($stateParams.event, $stateParams.slide, true).then(function (event) {
            var result = _.find(event.slides, function (task) {
                return task.slideId._id === $stateParams.slide;
            });

            $scope.slide = result.slideId;
        });

    }]);
});
