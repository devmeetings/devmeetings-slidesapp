define(['angular', 'xplatform/xplatform-app', '_'], function (angular, xplatformApp) {
    xplatformApp.controller('dmXplatformSaves', ['$scope', 'dmSlidesaves', function ($scope, dmSlidesaves) {
        dmSlidesaves.allSaves(false).then(function (saves) {
            $scope.saves = saves;
        });
    }]);
});
