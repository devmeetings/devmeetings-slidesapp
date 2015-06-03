define(['angular', 'dm-xplatform/xplatform-app', '_', 'dm-xplatform/services/dm-questions/dm-questions'], function (angular, xplatformApp) {
    xplatformApp.controller('dmXplatformQuestionCreate', function ($scope, $stateParams, dmQuestions, dmEvents, dmSlidesaves) {
       
        $scope.question = {
            title: '',
            description: '',
            event: $stateParams.event,
            workspace: true
        };

        $scope.createQuestion = function () {
            $scope.question.timestamp = new Date();
            if (!$scope.question.workspace) {
                dmQuestions.createQuestion($scope.question).then(function(){
                    $scope.question.description = '';
                });
                return;
            }

            dmEvents.getEvent($stateParams.event, true).then(function (data) {
                $scope.question.baseSlide = data.baseSlide;
                dmQuestions.createQuestion($scope.question).then(function () {
                    dmSlidesaves.allSaves(true); // update saves!, TODO ugly
                    $scope.question.description = ''; 
                });
            });
        };

    });
});
