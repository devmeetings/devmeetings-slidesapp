define(['angular', '_', 'angular-gravatar', 'xplatform/xplatform-app', 'slider/slider', 'services/User'], function (angular, _, angularGravatar, xplatformApp, slider, User) {
    angular.module('xplatform').controller('XplatformNavbarCtrl', ['$scope', '$filter', 'User', function ($scope, $filter, User) {
        $scope.navbar = {
            user: {}
        };

        User.getUserData( function (data) {
            $scope.navbar.user = data;
        });

    }]);
});

