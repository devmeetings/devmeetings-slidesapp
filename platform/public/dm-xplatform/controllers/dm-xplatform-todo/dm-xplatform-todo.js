define(['angular', 'xplatform/xplatform-app'], function (angular, xplatformApp) {
    xplatformApp.controller('dmXplatformTodo', ['$scope', '$stateParams', '$sce', 'dmEvents', function ($scope, $stateParams, $sce, dmEvents) {
        
        dmEvents.getEventTask($stateParams.event, $stateParams.iteration, $stateParams.todo).then(function (task) {
            $scope.url = $sce.trustAsResourceUrl(task.url);
        });

    }]);
});

