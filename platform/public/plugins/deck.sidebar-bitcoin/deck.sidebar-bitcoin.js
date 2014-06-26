define(['module', 'slider/slider.plugins'], function(module, sliderPlugins) {
    var path = sliderPlugins.extractPath(module);

    sliderPlugins.registerPlugin('deck.sidebar', 'bitcoin', 'decksidebar-bitcoin').directive('decksidebarBitcoin', [

        function() {
            return {
                restrict: 'E',
                scope: {
                    data: '=data',
                    slide: '=context'
                },
                templateUrl: path + '/deck.sidebar-bitcoin.html'
            };
        }
    ]);

});