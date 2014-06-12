define(['module', 'slider/slider.plugins'], function(module, sliderPlugins) {
    var path = sliderPlugins.extractPath(module);

    sliderPlugins.registerPlugin('slide', 'slide-microtasks-counter', 'slide-microtasks-counter' ).directive('slideMicrotasksCounter', [

        function() {
            return {
                restrict: 'E',
                scope: {
                    data: '=data',
                    slide: '=context'
                },
                templateUrl: path + '/slide-microtasks-counter.html',
                link: function (scope, element) {
                    scope.name = 'slide-microtasks-counter';
                }
            };
        }
    ]);

});
