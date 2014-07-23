define(['angular', '_', 'angular-gravatar', 'xplatform/xplatform-app', 'slider/slider', 'services/User'], function (angular, _, angularGravatar, xplatformApp, slider, User) {
    angular.module('xplatform').controller('XplatformNavbarCtrl', ['$scope', '$filter', 'User', function ($scope, $filter, User) {
        $scope.navbar = {
            searchText: '',
            user: {},
            showTitle: false,
            title: ''
        };

        User.getUserData( function (data) {
            $scope.navbar.user = data;
        });

    }]);
});

