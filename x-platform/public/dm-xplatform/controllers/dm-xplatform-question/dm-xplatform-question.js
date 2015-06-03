define(['angular', 'dm-xplatform/xplatform-app', '_', '../dm-xplatform-question-create/dm-xplatform-question-create'], function(angular, xplatformApp) {
  xplatformApp.controller('dmXplatformQuestion', function($scope, $rootScope, $modal, $stateParams, dmQuestions, dmEvents, dmUser) {

    function checkIfActive() {
      $scope.activeQuestion = $stateParams.slide;
      $scope.activeQuestionParent = $stateParams.parent;
      markAnyQuestionActive();
    }

    function markAnyQuestionActive() {
      if (!$scope.questions) {
        return;
      }
      $scope.isAnyQuestionActive = $scope.questions.reduce(function(isActive, question) {
        return isActive || isQuestionActive(question);
      }, false);
    }

    function isQuestionActive(question) {
      return $scope.activeQuestion === question.slidesave || $scope.activeQuestionParent === question.slidesave;
    }

    checkIfActive();
    var off = $rootScope.$on('$stateChangeSuccess', checkIfActive);
    $scope.$on('$destroy', off);

    $scope.isQuestionActive = isQuestionActive;
    dmQuestions.allQuestionsForEvent($stateParams.event, false).then(function(questions) {
      $scope.questions = questions;
      markAnyQuestionActive();
    });

    dmUser.getCurrentUser().then(function(user) {
      $scope.user = user;
    });

    $scope.showAnswers = function(question) {
      var modalInstance = $modal.open({
        templateUrl: '/static/dm-xplatform/controllers/dm-xplatform-question-answer/index.html',
        controller: 'dmXplatformQuestionAnswer',
        windowClass: 'dm-question-modal',
        resolve: {
          question: function() {
            return question;
          }
        }
      });
    };

    $scope.createComment = function(question) {
      // TODO[ToDr] Sharing state from workspace? WTF?!
      var state = dmEvents.getState($stateParams.event, 'save');
      dmQuestions.commentQuestion(question, {
        text: question.text
      }, state.save);
      question.text = '';
    };

  });
});
