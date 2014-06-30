require(['config'], function () {
    require(['angular', '_', 'angular-gravatar', 'slider/slider'], function (angular, _, angularGravatar, slider) {
        angular.module('xplatform').controller('XPlatformDevheroCtrl', ['$scope', function ($scope) {
            $scope.app = {
            };
        }]);
    });
});

