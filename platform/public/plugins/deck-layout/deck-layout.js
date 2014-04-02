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
                    sliderPlugins.listen(scope, 'slide.current.change', function(current, previous) {
                        Sockets.socket.emit('slide.current.change', current);
                    });
                }
            };
        }
    ]);

});