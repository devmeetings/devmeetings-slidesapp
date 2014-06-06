define(['module', 'slider/slider.plugins'], function(module, sliderPlugins) {
    var path = sliderPlugins.extractPath(module);

    sliderPlugins.registerPlugin('deck.sidebar', '*', 'deck-sidebar-stream').directive('deckSidebarStream', [
        'Sockets',
        function(Sockets) {
            return {
                restrict: 'E',
                scope: {
                    data: '=data',
                    slide: '=context'
                },
                templateUrl: path + '/deck.sidebar-stream.html',
                link: function(scope, element) {
                    scope.statuses = [];

                    scope.setStatus = function(status) {
                        Sockets.emit('stream.status', status);
                        scope.statuses.unshift({
                            date: new Date(),
                            status: status
                        });
                    };

                    Sockets.on('stream.status', function(status) {
                        scope.$apply(function() {
                            scope.statuses.unshift({
                                date: new Date(),
                                status: status
                            });
                        });
                    });

                }
            };
        }
    ]);

});