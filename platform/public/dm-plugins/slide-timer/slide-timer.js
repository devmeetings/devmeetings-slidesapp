define(['module', 'slider/slider.plugins'], function(module, sliderPlugins) {

    var path = sliderPlugins.extractPath(module);

    function t() {
        return new Date().getTime();
    }

    sliderPlugins.registerPlugin('slide', 'timer', 'slide-timer', 10).directive('slideTimer', [
        '$timeout',
        function($timeout) {
            return {
                restrict: 'E',
                replace: true,
                scope: {
                    time: '=data',
                    slide: '=context'
                },
                templateUrl: path + '/slide-timer.html',
                link: function(scope) {
                    scope.started = false;
                    scope.endDate = t();

                    scope.start = function() {
                        scope.endDate = t() + parseFloat(scope.time) * 60 * 1000;
                        scope.started = true;
                        onTimer();
                    };

                    function onTimer() {
                        if (!scope.started) {
                            return;
                        }
                        if (scope.currentTime <= 0) {
                            scope.started = false;
                            return;
                        }
                        var currentTime = t();
                        scope.timeLeft = (scope.endDate - currentTime) / 1000;

                        $timeout(onTimer, 100);
                    }
                }
            };
        }
    ]);

});