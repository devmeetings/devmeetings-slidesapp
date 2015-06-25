define(['module',
  'angular',
  '_',
  'dm-admin/dm-admin-app'
], function (module, angular, _, adminApp) {
  adminApp.controller('dmAdminQuiz', ['$scope', '$http',
    function ($scope, $http) {
      $scope.quiz = 'AngularAssessment';
      $scope.options = {
        minAnswers: 3,
        searchForEmail: false
      };

      $scope.$watch('quiz', function (quiz) {
        $http.get('/api/quizAnswers/' + quiz).then(function (q) {
          $scope.answers = q.data;
        }, function () {
          $scope.answers = [];
        });
      });

      $scope.minAnswersFilter = function (answer) {
        return answer.answers.length >= $scope.options.minAnswers;
      };
      $scope.searchForEmailFilter = function (answer) {
        if ($scope.options.searchForEmail) {
          return $scope.findField(answer, 'email').length || $scope.findField(answer, 'nick').length;
        }
        return true;
      };

      $scope.findField = function (answer, field) {
        return answer.answers.map(function (x) {
          return x[field];
        }).filter(function (x) {
          return x;
        });
      };

      $scope.comments = {};

    }
  ]);
});
