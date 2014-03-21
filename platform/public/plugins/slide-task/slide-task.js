define(['module', 'slider/slider.plugins'], function(module, sliderPlugins) {
    var path = sliderPlugins.extractPath(module);

    sliderPlugins.registerPlugin('slide', 'task', 'slide-task', 1).directive('slideTask', [

        function() {
            return {
                restrict: 'E',
                scope: {
                    task: '=data',
                    slide: '=context'
                },
                templateUrl: path + '/slide-task.html'
            };
        }
    ]);

});