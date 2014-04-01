define(['_', 'slider/slider.plugins', 'socket.io'], function(_, sliderPlugins, io) {

    sliderPlugins.registerPlugin('deck', 'title', 'deck-websockets').directive('deckWebsockets', [
        '$location',
        function($location) {

            var socket = io.connect('http://' + $location.host());

            return {
                restrict: 'E',
                scope: {
                    title: '=data',
                    deck: '=context'
                },
                template: '<div></div>',
                link: function(scope, element) {
                    socket.emit('hello', scope.title);
                }
            };
        }
    ]);

});