define(['angular', '_', 'angular-gravatar', 'xplatform/xplatform-app', 'slider/slider'], function (angular, _, angularGravatar, xplatformApp, slider) {
    xplatformApp.controller('dmXplatformDevhero', ['$scope', '$stateParams', 'dmUser', 'dmObserve', function ($scope, $stateParams, dmUser, dmObserve) {
        var userId = $stateParams.id;
        $scope.navbar.showTitle = true;
        $scope.navbar.title = '';
        dmUser.getUserWithId(userId).then(function (user) {
            $scope.user = user;
            $scope.navbar.title = user.name;
        });

        dmObserve.canBeObserved(userId).then(function (bool) {
            $scope.canBeObserved = bool;
        });

        $scope.observe = function () {
            dmObserve.observe($scope.user._id, $scope.user.name, $scope.user.email);
            $scope.canBeObserved = false;
        };

        $scope.unobserve = function () {
            dmObserve.unobserve($scope.user._id);
            $scope.canBeObserved = true;
        };


    }]);
});

