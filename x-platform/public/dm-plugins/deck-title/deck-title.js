define(['module', 'slider/slider.plugins'], function(module, sliderPlugins) {
    var path = sliderPlugins.extractPath(module);

    sliderPlugins.registerPlugin('deck', 'title', 'deck-title' ).directive('deckTitle', [
        '$rootScope', function($rootScope) {
            return {
                restrict: 'E',
                scope: {
                    title: '=data',
                    slide: '=context'
                },
                link: function (scope, element) {
                    $rootScope.title = scope.title; 
                }
            };
        }
    ]);

});
