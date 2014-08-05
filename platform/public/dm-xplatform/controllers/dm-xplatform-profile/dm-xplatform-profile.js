define(['angular', 'xplatform/xplatform-app'], function (angular, xplatformApp) {
    xplatformApp.controller('dmXplatformProfile', ['$scope', '$stateParams', 'dmUser', function ($scope, $stateParams, dmUser) {
        dmUser.getCurrentUser().then(function (data) {
            $scope.userData = data;
            $scope.editedUser  = angular.copy(data.result);
        });

        $scope.cancel = function () {
            $scope.editedUser = angular.copy($scope.userData.result);
        };

        $scope.save = function () {
            dmUser.saveCurrentUser($scope.editedUser);
        };

    }]);
});
