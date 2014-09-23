define(['angular', 'xplatform/xplatform-app', '_'], function (angular, xplatformApp) {
    xplatformApp.controller('dmXplatformQuestion', ['$scope', '$modal', function ($scope, $modal) {
       

        $scope.showAnswers = function () {
            var modalInstance = $modal.open({
                templateUrl: '/static/dm-xplatform/controllers/dm-xplatform-question-answer/index.html',
                controller: 'dmXplatformQuestionAnswer',
                windowClass: 'dm-question-modal'
            });
        };

    }]);
});
