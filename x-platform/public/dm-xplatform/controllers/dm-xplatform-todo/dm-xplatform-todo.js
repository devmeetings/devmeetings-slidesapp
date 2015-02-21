define(['angular', 'xplatform/xplatform-app'], function (angular, xplatformApp) {
    xplatformApp.controller('dmXplatformTodo', ['$scope', '$stateParams', '$sce', 'dmEvents', 'dmBrowserTab',
        function($scope, $stateParams, $sce, dmEvents, dmBrowserTab) {
        
        dmEvents.getEventTask($stateParams.event, $stateParams.iteration, $stateParams.todo).then(function (task) {

            dmBrowserTab.setTitleAndIcon(task.title, 'todo');
            $scope.url = $sce.trustAsResourceUrl(task.url);
        });

    }]);
});

