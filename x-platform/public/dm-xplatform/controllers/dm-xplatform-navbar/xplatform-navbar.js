define(['angular', '_', 'angular-gravatar', 'xplatform/xplatform-app', 'slider/slider', 'services/User'], function (angular, _, angularGravatar, xplatformApp, slider, User) {
    angular.module('xplatform').controller('XplatformNavbarCtrl', ['$scope', '$filter', 'dmUser', function ($scope, $filter, dmUser) {
        
        dmUser.getCurrentUser().then(function (data) {
            $scope.user = data;
        });

    }]);
});

