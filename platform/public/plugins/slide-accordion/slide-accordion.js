define(['module', 'slider/slider.plugins'], function(module, sliderPlugins) {

    var path = sliderPlugins.extractPath(module);

    sliderPlugins.registerPlugin('slide', 'accordion', 'slide-accordion').directive('slideAccordion', [

        function() {
            return {
                restrict: 'E',
                scope: {
                    data: '=data',
                    slide: '=context'
                },
                templateUrl: path + '/part.html',
                link: function(scope) {
                    
                }
            };
        }
    ]);
});

