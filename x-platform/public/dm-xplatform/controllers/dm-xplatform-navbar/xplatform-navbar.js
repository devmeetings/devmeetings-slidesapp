/* globals define */
define(['angular', '_', 'dm-xplatform/xplatform-app', 'slider/slider', 'services/User'], function (angular, _, xplatformApp, slider, User) {
  angular.module('xplatform').controller('XplatformNavbarCtrl', ['$scope', '$filter', 'dmUser', function ($scope, $filter, dmUser) {
    dmUser.getCurrentUser().then(function (data) {
      $scope.user = data;
    });

  }]);
});
