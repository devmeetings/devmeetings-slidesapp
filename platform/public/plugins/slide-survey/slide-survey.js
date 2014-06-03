define(['module', 'slider/slider.plugins'], function(module, sliderPlugins) {
    var path = sliderPlugins.extractPath(module);

    sliderPlugins.registerPlugin('slide', 'survey', 'slide-survey', 50).directive('slideSurvey', [
        'Sockets',
        function(Sockets) {
            return {
                restrict: 'E',
                scope: {
                    survey: '=data',
                    slide: '=context'
                },
                templateUrl: path + '/slide-survey.html',
                link: function(scope, element) {
                    scope.paymentData = {};

                    scope.sendAnswers = function() {
                        Sockets.emit('survey.submit', {
                            answers: scope.survey.questions,
                            payment: scope.survey.payment
                        }, function() {
                            console.log(arguments);
                            scope.$apply(function() {
                                if (scope.survey.payment > 0) {
                                    scope.showPayment = true;
                                    scope.paymentData = {
                                        workshop: scope.survey.workshop,
                                        payment: scope.survey.payment
                                    };
                                }
                            });
                        });
                    };

                }
            };
        }
    ]);

});