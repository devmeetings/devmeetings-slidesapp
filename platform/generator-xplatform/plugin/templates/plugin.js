define(['slider/slider.plugins'], function(sliderPlugins) {
    sliderPlugins.registerPlugin('<%= pluginType %>', '<%= pluginKey %>', '<%= nameDash %>' ).directive('<%= nameCamel %>', [

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
