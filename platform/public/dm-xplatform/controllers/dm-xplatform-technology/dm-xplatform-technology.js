define(['angular', 'xplatform/xplatform-app'], function (angular, xplatformApp) {
    xplatformApp.controller('dmXplatformTechnology', ['$scope', '$stateParams', function ($scope, $stateParams) {
        $scope.xplatformData.navbar.title = $stateParams.name;
        $scope.xplatformData.navbar.showTitle = true;
        
    }]);
});
