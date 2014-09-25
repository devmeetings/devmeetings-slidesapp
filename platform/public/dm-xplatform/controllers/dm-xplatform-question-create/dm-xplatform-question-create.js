define(['angular', 'xplatform/xplatform-app', '_', 'xplatform/services/dm-questions/dm-questions'], function (angular, xplatformApp) {
    xplatformApp.controller('dmXplatformQuestionCreate', ['$scope', '$stateParams', 'dmQuestions', 'dmEvents', function ($scope, $stateParams, dmQuestions, dmEvents) {
       
        $scope.question = {
            title: '',
            description: '',
            event: $stateParams.event,
            timestamp: new Date(),
            workspace: true
        };

        $scope.createQuestion = function () {
            if (!$scope.question.workspace) {
                dmQuestions.createQuestion($scope.question); 
                $scope.$dismiss();
                return;
            }

            dmEvents.getEvent($stateParams.event, true).then(function (data) {
                $scope.question.baseSlide = data.baseSlide;
                dmQuestions.createQuestion($scope.question); 
                $scope.$dismiss();
            });
        };

    }]);
});
