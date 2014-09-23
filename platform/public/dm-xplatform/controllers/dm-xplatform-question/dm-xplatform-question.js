define(['angular', 'xplatform/xplatform-app', '_'], function (angular, xplatformApp) {
    xplatformApp.controller('dmXplatformQuestion', ['$scope', '$modal', '$stateParams', 'dmQuestions', function ($scope, $modal, $stateParams, dmQuestions) {
       
        dmQuestions.allQuestionsForEvent($stateParams.event, false).then(function (questions) {
            $scope.questions = questions;
        });

        $scope.showAnswers = function (question) {
            var modalInstance = $modal.open({
                templateUrl: '/static/dm-xplatform/controllers/dm-xplatform-question-answer/index.html',
                controller: 'dmXplatformQuestionAnswer',
                windowClass: 'dm-question-modal',
                resolve: {
                    question: function () {
                        return question;
                    }
                }
            });
        };

    }]);
});
