define(['slider/slider.plugins'], function(sliderPlugins) {
    sliderPlugins.registerPlugin('slide', 'title', 'slide-title', 1).directive('slideTitle', [

        function() {
            return {
                restrict: 'E',
                scope: {
                    title: '=data',
                    slide: '=context'
                },
                template: '<h1 ng-bind-html="title"></h1>'
            };
        }
    ]);

});