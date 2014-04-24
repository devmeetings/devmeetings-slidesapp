define(['module', 'slider/slider.plugins'], function(module, sliderPlugins) {

    var path = sliderPlugins.extractPath(module);

    sliderPlugins.registerPlugin('slide', 'left', 'slide-left', 9).directive('slideLeft', [

        function() {
            return {
                restrict: 'E',
                scope: {
                    data: '=data',
                    slide: '=context'
                },
                templateUrl: path + '/part.html',
                link: function(scope) {
                    scope.size = 7;
                }
            };
        }
    ]);

    sliderPlugins.registerPlugin('slide', 'right', 'slide-right', 10).directive('slideRight', [

        function() {
            return {
                restrict: 'E',
                scope: {
                    data: '=data',
                    slide: '=context'
                },
                templateUrl: path + '/part.html',
                link: function(scope) {
                    scope.size = 5;
                }
            };
        }
    ]);

});
