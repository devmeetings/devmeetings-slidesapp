define(['angular', 'dm-xplatform/xplatform-app'], function (angular, xplatformApp) {
  xplatformApp.controller('dmXplatformRegister', ['$scope', '$modalInstance', '$state', '$location', function ($scope, $modalInstance, $state, $location) {
    $scope.url = $location.$$absUrl;
    $scope.gotoLogin = function () {
      $modalInstance.close();
      $state.go('index.login');
    };
  }]);
});
