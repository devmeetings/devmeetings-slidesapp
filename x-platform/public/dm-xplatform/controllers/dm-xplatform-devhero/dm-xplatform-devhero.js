/* globals define */
define(['angular', '_', 'dm-xplatform/xplatform-app', 'slider/slider'], function (angular, _, xplatformApp, slider) {
  xplatformApp.controller('dmXplatformDevhero', function ($scope, $stateParams, dmUser, dmBrowserTab) {
    dmBrowserTab.setTitleAndIcon('Devhero');
    var userId = $stateParams.id;
    $scope.xplatformData.navbar.showTitle = true;
    $scope.xplatformData.navbar.title = '';

    dmUser.getUserWithId(userId).then(function (user) {
      $scope.user = user;
      $scope.xplatformData.navbar.title = user.name;
      dmBrowserTab.setTitleAndIcon(user.name + ' - Devhero');
    });

  });
});
