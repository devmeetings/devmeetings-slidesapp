define(['angular', 'xplatform/xplatform-app', '_', 'xplatform/services/dm-questions/dm-questions'], function (angular, xplatformApp) {
    xplatformApp.controller('dmXplatformQuestionCreate', ['$scope', '$stateParams', 'dmQuestions', function ($scope, $stateParams, dmQuestions) {
       
        $scope.question = {
            title: '',
            description: '',
            event: $stateParams.event,
            timestamp: new Date()
        };

        $scope.createQuestion = function () {
            dmQuestions.createQuestion($scope.question);
        };

    }]);
});
