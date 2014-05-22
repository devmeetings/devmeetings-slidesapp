define(['slider/slider.plugins'], function(sliderPlugins) {
    sliderPlugins.registerPlugin('slide', 'text', '<%= name_dash %>' ).directive('<%= name_camel %>', [

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
