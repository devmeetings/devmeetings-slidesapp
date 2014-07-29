define(['angular', '_', 'angular-gravatar', 'xplatform/xplatform-app', 'slider/slider'], function (angular, _, angularGravatar, xplatformApp, slider) {
    xplatformApp.controller('dmXplatformDevhero', ['$scope', '$stateParams', 'dmUser', function ($scope, $stateParams, dmUser) {
        var userId = $stateParams.id;
        $scope.navbar.showTitle = true;
        $scope.navbar.title = '';
        dmUser.getUserWithId(userId).then(function (user) {
            $scope.user = user;
            $scope.navbar.title = user.name;
        });
    }]);
});

