define(['angular', 'xplatform/xplatform-app'], function (angular, xplatformApp) {
    xplatformApp.controller('dmXplatformObserved', ['$scope', 'dmObserve', function ($scope, dmObserve) {
        dmObserve.getObserved().then(function (data) {
            $scope.observed = data.result.observed;
        });
    }]);
});
