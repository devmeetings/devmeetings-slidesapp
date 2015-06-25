define(['angular', 'dm-xplatform/xplatform-app'], function (angular, xplatformApp) {
  xplatformApp.controller('dmXplatformLogin', ['$scope', '$modalInstance', '$state', '$location', function ($scope, $modalInstance, $state, $location) {
    $scope.redirectUrl = $location.$$absUrl;
    $scope.gotoRegister = function () {
      $modalInstance.close();
      $state.go('index.register');
    };
  }]);
});
