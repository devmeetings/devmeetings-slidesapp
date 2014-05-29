define(['module', 'slider/slider.plugins'], function(module, sliderPlugins) {
    var path = sliderPlugins.extractPath(module);

    sliderPlugins.registerPlugin('deck.sidebar', '*', 'decksidebar-screenleap', 1).directive('decksidebarScreenleap', [

        function() {
            return {
                restrict: 'E',
                scope: {
                    data: '=data',
                    slide: '=context'
                },
                templateUrl: path + '/decksidebar-screenleap.html',
                link: function(scope, element) {
                    scope.name = 'decksidebar-screenleap';
                }
            };
        }
    ]);

});