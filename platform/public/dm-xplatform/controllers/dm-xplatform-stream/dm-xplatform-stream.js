define(['angular', 'xplatform/xplatform-app'], function (angular, xplatformApp) {
    xplatformApp.controller('dmXplatformStream', ['$scope', '$stateParams', 'dmStream', function ($scope, $stateParams, dmStream) {
        if ($stateParams.id) {
            dmStream.getUserStream($stateParams.id).then(function (data) {
                $scope.stream = data;
            });
        } else {
            dmStream.getStream().then(function (data) {
                $scope.stream = data;
            });
        }
    }]);
});
