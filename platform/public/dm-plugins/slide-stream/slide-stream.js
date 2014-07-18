define(['module', 'slider/slider.plugins', 'services/Sockets', 'services/DeckAndSlides'], function(module, sliderPlugins) {
    var path = sliderPlugins.extractPath(module);

    sliderPlugins.registerPlugin('slide', 'stream_hide', 'slide-stream').directive('slideStream', [
        'Sockets', 'DeckAndSlides', '$timeout',
        function(Sockets, DeckAndSlides, $timeout) {

            return {
                restrict: 'E',
                scope: {
                    data: '=data',
                    slide: '=context'
                },
                templateUrl: path + '/slide-stream.html',
                link: function(scope, element) {
                    scope.isNew = false;

                    Sockets.on('stream.update', function(stream) {
                        scope.$apply(function() {
                            scope.isNew = true;
                            scope.stream = stream;

                            $timeout(function() {
                                scope.isNew = false;
                            }, 500);
                        });
                    });

                    var streamId = DeckAndSlides.slideId;
                    Sockets.emit('stream.get', streamId);
                }
            };
        }
    ]);

});
