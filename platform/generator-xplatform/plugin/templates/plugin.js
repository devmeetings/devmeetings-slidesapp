define(['module', 'slider/slider.plugins'], function(module, sliderPlugins) {
    var path = sliderPlugins.extractPath(module);

    sliderPlugins.registerPlugin('<%= pluginNameSpace %>', '<%= pluginTrigger %>', '<%= nameDash %>' ).directive('<%= nameCamel %>', [

        function() {
            return {
                restrict: 'E',
                scope: {
                    data: '=data',
                    slide: '=context'
                },
                <%= pluginTemplateText %>,
                link: function (scope, element) {
                    scope.name = '<%= nameDash %>';
                }
            };
        }
    ]);

});
