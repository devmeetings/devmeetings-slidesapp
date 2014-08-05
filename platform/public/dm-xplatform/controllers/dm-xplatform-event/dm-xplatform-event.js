define(['angular', 'xplatform/xplatform-app'], function (angular, xplatformApp) {
    xplatformApp.controller('dmXplatformEvent', ['$scope', '$stateParams', '$http', function ($scope, $stateParams, $http) {
        var id = $stateParams.id;
        $scope.xplatformData.navbar.title = '';
        $scope.xplatformData.navbar.showTitle = true;
    
        $http.get('/api/event/' + id).success(function (event) {
            $scope.event = event;
            $scope.xplatformData.navbar.title = event.title;
        });
    }]);
});
