define(['angular', 'xplatform/xplatform-app', '_', '../dm-xplatform-question-create/dm-xplatform-question-create'], function (angular, xplatformApp) {
    xplatformApp.controller('dmXplatformQuestion', ['$scope', '$modal', '$stateParams', 'dmQuestions', 'dmEvents', function ($scope, $modal, $stateParams, dmQuestions, dmEvents) {
       
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
        
        $scope.createComment = function (question) {
            var state = dmEvents.getState($stateParams.event, 'save');
            dmQuestions.commentQuestion(question, {
                text: question.text 
            }, state.save);
            question.text = '';
        };

    }]);
});

