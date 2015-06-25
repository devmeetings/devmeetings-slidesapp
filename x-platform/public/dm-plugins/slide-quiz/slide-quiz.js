define(['module', '_', 'slider/slider.plugins', './slide-quiz.html!text'], function (module, _, sliderPlugins, viewTemplate) {
  'use strict';

  sliderPlugins.registerPlugin('slide.sidebar', 'quiz', 'slide-quiz', {
    order: 4000,
    name: 'Quiz',
    description: 'Quiz Question',
    example: {
      meta: {
        progress: [{
          type: 'number',
          help: 'Current Step'
        }, {
          type: 'number',
          help: 'Total number of steps'
        }],
        quizId: {
          type: 'string',
          help: 'Unique Id of Quiz - simplifies viewing in admin panel'
        },
        taskId: {
          type: 'string',
          help: 'Unique id of task (inside quiz).'
        },
        nextSlideId: {
          type: 'string',
          help: 'Redirect user to this slide after completing this question.'
        },
        getEmail: {
          type: 'bool',
          help: 'Should ask user for e-mail address (only if no nextSlideId)'
        },
        getNick: {
          type: 'bool',
          help: 'Should ask user for nickname (only if no nextSlideId)'
        }
      },
      data: {
        progress: [1, 3],
        quizId: 'myQuiz1',
        taskId: 'firstTask',
        nextSlideId: '123asdfa9sd8fa9sd8f'
      }
    }
  }).directive('slideQuiz', [
    '$http', '$window', 'DeckAndSlides',
    function ($http, $window, DeckAndSlides) {
      var store = {
        get: function (quizId) {
          return $window.localStorage['quiz-' + quizId] || '';
        },
        set: function (quizId, id) {
          $window.localStorage['quiz-' + quizId] = id;
        }
      };

      return {
        restrict: 'E',
        scope: {
          quiz: '=data',
          slide: '=context'
        },
        template: viewTemplate,
        link: function (scope, element) {
          var taskId = scope.quiz.taskId || '';
          scope.data = {};

          scope.submit = function (description, email, nick) {
            var nextSlideId = scope.quiz.nextSlideId;
            var lastId = store.get(scope.quiz.quizId);

            var answer = {
              quizId: scope.quiz.quizId,
              taskId: taskId,
              slideId: DeckAndSlides.slideId,
              email: email,
              nick: nick,
              description: description,
              content: angular.copy(scope.slide)
            };

            scope.sending = true;
            $http.post(lastId ? '/api/quiz/' + lastId : '/api/quiz', answer).then(function (id) {
              store.set(scope.quiz.quizId, id.data);
              scope.finished = true;
              // Go to next question (if any)
              if (nextSlideId) {
                $window.location = '/slides/' + nextSlideId;
              }
            }, function () {
              $window.alert('Nie udało się wysłać odpowiedzi.');
            });

          };
        }
      };
    }
  ]);

});
