define(['slider/slider.plugins'], function(sliderPlugins) {
    sliderPlugins.registerPlugin('slide', 'text', 'slide-text', 2).directive('slideText', [

        function() {
            return {
                restrict: 'E',
                scope: {
                    text: '=data',
                    slide: '=context'
                },
                template: '<div ng-bind-html="text"></div>'
            };
        }
    ]);

});
