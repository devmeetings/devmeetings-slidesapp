define(['_', 'slider/slider', 'socket.io'], function(_, slider, io) {
    slider.factory('Sockets', ['$location',
        function($location) {

            return {
                socket: io.connect('http://' + $location.host())
            };
        }
    ]);
});