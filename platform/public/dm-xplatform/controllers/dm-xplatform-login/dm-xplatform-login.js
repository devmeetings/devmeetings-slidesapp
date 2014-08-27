define(['angular', 'xplatform/xplatform-app'], function (angular, xplatformApp) {
    xplatformApp.controller('dmXplatformLogin', ['$scope', '$modalInstance', '$state', function ($scope, $modalInstance, $state) {
        $scope.gotoRegister = function () {
            $modalInstance.close();
            $state.go('index.register');
        };
    }]);
});
