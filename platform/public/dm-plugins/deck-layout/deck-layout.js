define(['_', 'slider/slider.plugins', 'services/Sockets'], function(_, sliderPlugins) {

    sliderPlugins.registerPlugin('deck', 'title', 'deck-layout').directive('deckLayout', [
        'Sockets',
        function(Sockets) {

            return {
                restrict: 'E',
                scope: {
                    title: '=data',
                    deck: '=context'
                },
                template: '<div></div>',
                link: function(scope, element) {
                    Sockets.forwardEventToServer('slide.current.change');
                }
            };
        }
    ]);

});
