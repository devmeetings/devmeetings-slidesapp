define(['_', 'slider/slider.plugins', 'services/DeckAndSlides'], function(_, sliderPlugins, DeckAndSlides) {

    var EXECUTION_DELAY = 500;

    sliderPlugins.registerPlugin('slide.edit', '*', 'slide-edit-sync' ).directive('slideEditSync', [

        function() {
            return {
                restrict: 'E',
                scope: {
                    data: '=data',
                    slide: '=context'
                },
                controller: 'SlideEditSyncController'
            };
        }
    ]).controller('SlideEditSyncController', ['$scope', 'Sockets', 'DeckAndSlides',
        function($scope, Sockets, DeckAndSlides) {
        
            $scope.$watch('slide', function (newSlide, oldSlide){
                if (newSlide === undefined) {
                    return;
                }
                Sockets.emit('slide.edit.put', {
                    _id: DeckAndSlides.slideId,
                    content: angular.copy(newSlide)
                });
            }, true);
        }
    ]);
});
