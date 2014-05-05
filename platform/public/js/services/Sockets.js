define(['_', 'slider/slider.plugins', 'socket.io'], function(_, sliderPlugins, io) {

    sliderPlugins.factory('Sockets', ['$location',
        function($location) {

            var Sockets = {
                socket: io.connect('http://' + $location.host()),
                forwardEventToServer: function(evName) {
                    forwardedEvents[evName] = true;
                }
            };

            var forwardedEvents = {};

            // Forward events
            sliderPlugins.on('*', function(evName) {
                var args = [].slice.call(arguments, 1);

                if (forwardedEvents[evName]) {
                    Sockets.socket.emit(evName, args);
                }
            });

            return Sockets;
        }
    ]);

});