define(['module', 'slider/slider.plugins', './Timer'], function(module, sliderPlugins) {
    var path = sliderPlugins.extractPath(module);

    sliderPlugins.registerPlugin('slide', 'task', 'slide-task', 1).directive('slideTask', [
        'Timer',
        function(Timer) {
            return {
                restrict: 'E',
                scope: {
                    task: '=data',
                    slide: '=context'
                },
                templateUrl: path + '/slide-task.html',
                link: function(scope) {
                    scope.timerState = new Timer(scope.task.duration);
                }
            };
        }
    ]);

});