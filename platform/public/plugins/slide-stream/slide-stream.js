define(['module', 'slider/slider.plugins', 'services/Sockets'], function(module, sliderPlugins) {
    var path = sliderPlugins.extractPath(module);

    sliderPlugins.registerPlugin('slide', 'stream', 'slide-stream').directive('slideStream', [
        'Sockets',
        function(Sockets) {

            return {
                restrict: 'E',
                scope: {
                    data: '=data',
                    slide: '=context'
                },
                templateUrl: path + '/slide-stream.html',
                link: function(scope, element) {

                    Sockets.on('stream.update', function(stream) {
                        scope.$apply(function() {
                            scope.stream = stream;
                        });
                    });

                    Sockets.emit('stream.get', '??');

                }
            };
        }
    ]);

});