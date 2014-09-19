define(['angular', 'xplatform/xplatform-app'], function (angular, xplatformApp) {
    xplatformApp.controller('dmXplatformTodo', ['$scope', '$stateParams', '$sce', 'dmEvents', function ($scope, $stateParams, $sce, dmEvents) {
        dmEvents.getEvent($stateParams.event, false).then(function (data) {
            var todo = _.find(data.iterations[$stateParams.iteration].tasks, function (elem) {
                return elem._id === $stateParams.todo;
            });
               
            $scope.url = $sce.trustAsResourceUrl(todo.url);
        });
    }]);
});
