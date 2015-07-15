/* globals define */
define(['angular', '_', 'slider/slider.plugins', 'services/DeckAndSlides'], function (angular, _, sliderPlugins, DeckAndSlides) {

  sliderPlugins.registerPlugin('slide.edit', '*', 'slide-edit-sync', {
    name: 'Edit-sync',
    description: 'Saves Slide content on server while edit mode is active.',
    example: {}
  }).directive('slideEditSync', [

    function () {
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
    function ($scope, Sockets, DeckAndSlides) {
      $scope.$watch('slide', function (newSlide, oldSlide) {
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
