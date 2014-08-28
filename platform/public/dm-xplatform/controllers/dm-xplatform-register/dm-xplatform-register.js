define(['angular', 'xplatform/xplatform-app'], function (angular, xplatformApp) {
    xplatformApp.controller('dmXplatformRegister', ['$scope', '$modalInstance', '$state', function ($scope, $modalInstance, $state) {
        $scope.gotoLogin = function () {
            $modalInstance.close();
            $state.go('index.login');
        };
    }]);
});
