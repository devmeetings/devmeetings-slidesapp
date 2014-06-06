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

                    scope.treasures = [{
                        text: "Nagranie z warsztatu LUB dostęp do kodu",
                        value: 10
                    }, {
                        text: "Dyplom uczestnictwa + dostęp do kodu + nagranie z wasztatu",
                        value: 20,
                    }, {
                        text: "Wyjście na piwo z ekipa devmeetings",
                        value: 0,
                        maxValue: 1
                    }];
                    

                    scope.showTreasure = function(x){
                        var first = x.value <= scope.survey.payment;
                        if (x.maxValue) {
                            return first && scope.survey.payment < x.maxValue;
                        }
                        return first;
                    };

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
