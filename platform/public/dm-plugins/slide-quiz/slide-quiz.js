define(['module', '_', 'slider/slider.plugins'], function(module, _, sliderPlugins) {
    'use strict';

    var path = sliderPlugins.extractPath(module);

    sliderPlugins.registerPlugin('slide.sidebar', 'quiz', 'slide-quiz', 4000).directive('slideQuiz', [
        '$http', '$window', 'DeckAndSlides',
        function($http, $window, DeckAndSlides) {

            var store = {
                get: function(quizId) {
                    return $window.localStorage['quiz-' + quizId] || "";
                },
                set: function(quizId, id) {
                    $window.localStorage['quiz-' + quizId] = id;
                }
            };

            return {
                restrict: 'E',
                scope: {
                    quiz: '=data',
                    slide: '=context'
                },
                templateUrl: path + '/slide-quiz.html',
                link: function(scope, element) {
                    var taskId = scope.quiz.taskId || "";
                    scope.data = {};

                    scope.submit = function(description, email, nick) {
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
                        $http.post(lastId ? '/api/quiz/' + lastId : "/api/quiz", answer).then(function(id) {
                            store.set(scope.quiz.quizId, id.data);
                            scope.finished = true;
                            // Go to next question (if any)
                            if (nextSlideId) {
                                $window.location = '/slides/' + nextSlideId;
                            }
                        }, function() {
                            $window.alert('Nie udało się wysłać odpowiedzi.');
                        });

                    };
                }
            };
        }
    ]);

});