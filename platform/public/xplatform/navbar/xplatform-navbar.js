require(['config'], function () {
    require(['angular', '_', 'angular-gravatar', 'slider/slider', 'services/User'], function (angular, _, angularGravatar, slider, User) {
        angular.module('xplatform').controller('XplatformNavbarCtrl', ['$scope', '$filter', 'User', function ($scope, $filter, User) {
            $scope.navbar = {
                searchText: '',
                user: {}
            };

            User.getUserData( function (data) {
                $scope.navbar.user = data;
            });

        }]);

        angular.bootstrap(document, ['xplatform']);
    });
});
