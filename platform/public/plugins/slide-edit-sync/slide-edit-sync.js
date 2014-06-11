define(['_', 'slider/slider.plugins'], function(_, sliderPlugins) {

    var EXECUTION_DELAY = 500;

    sliderPlugins.registerPlugin('slide.edit', '*', 'slide-edit-sync' ).directive('slideEditSync', [

        function() {
            return {
                restrict: 'E',
                scope: {
                    data: '=data',
                    slide: '=context'
                }
            };
        }
    ]).controller('SlideEditSyncController', ['$scope', 'Sockets',
        function($scope, Sockets) {
            _.forEach(['css', 'html', 'js'], function (trigger) {
                sliderPlugins.listen($scope, 'slide.slide-fiddle.change', _.debounce( function(fiddle) {
                
                }, EXECUTION_DELAY));
            });
        }
    ]);
});
