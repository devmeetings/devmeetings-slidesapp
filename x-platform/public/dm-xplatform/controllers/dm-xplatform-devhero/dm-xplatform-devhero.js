define(['angular', '_', 'angular-gravatar', 'xplatform/xplatform-app', 'slider/slider'], function (angular, _, angularGravatar, xplatformApp, slider) {
    xplatformApp.controller('dmXplatformDevhero', ['$scope', '$stateParams', 'dmUser', 'dmObserve', 'dmStream', 'dmBrowserTab',
        function ($scope, $stateParams, dmUser, dmObserve, dmStream, dmBrowserTab) {
        dmBrowserTab.setTitleAndIcon('Devhero');
        var userId = $stateParams.id;
        $scope.xplatformData.navbar.showTitle = true;
        $scope.xplatformData.navbar.title = '';
        dmUser.getUserWithId(userId).then(function (user) {
            $scope.user = user;
            $scope.xplatformData.navbar.title = user.name;
            dmBrowserTab.setTitleAndIcon(user.name + ' - Devhero');
        });

        dmObserve.canBeObserved(userId).then(function (bool) {
            $scope.canBeObserved = bool;
        });

        $scope.observe = function () {
            dmObserve.observe($scope.user._id, $scope.user.name, $scope.user.avatar);
            $scope.canBeObserved = false;
            dmStream.markNeedUpdate();
        };

        $scope.unobserve = function () {
            dmObserve.unobserve($scope.user._id);
            $scope.canBeObserved = true;
            dmStream.markNeedUpdate();
        };

    }]);
});

