/* globals define */
define(['angular', 'dm-xplatform/xplatform-app'], function (angular, xplatformApp) {
  xplatformApp.controller('dmXplatformProfile', ['$scope', '$stateParams', '$state', 'dmUser', function ($scope, $stateParams, $state, dmUser) {
    dmUser.getCurrentUser().then(function (data) {
      $scope.userData = data;
      $scope.editedUser = angular.copy(data.result);
    });

    $scope.cancel = function () {
      $scope.editedUser = angular.copy($scope.userData.result);
    };

    $scope.save = function () {
      dmUser.saveCurrentUser($scope.editedUser);
      $state.go('index.devhero', {
        id: $scope.userData.result._id
      });

    };

  }]);
});
