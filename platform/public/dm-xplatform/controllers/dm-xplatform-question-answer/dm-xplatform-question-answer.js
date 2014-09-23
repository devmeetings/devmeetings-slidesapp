define(['angular', 'xplatform/xplatform-app', '_'], function (angular, xplatformApp) {
    xplatformApp.controller('dmXplatformQuestionAnswer', ['$scope', '$stateParams', 'dmQuestions', 'question', function ($scope, $stateParams, dmQuestions, question) {
        $scope.comment = {
        };

        $scope.question = question;
        
        $scope.createComment = function () {
            dmQuestions.commentQuestion(question, $scope.comment.text);
        };

    }]);
});
