/* globals define */
define([
  'slider/slider',
  'slider/slider.plugins',
  'slider/bootstrap',
  'services/DeckAndSlides',
  'directives/plugins-loader'
], function (slider, sliderPlugins, bootstrap) {
  slider.controller('SlideCtrl', function ($rootScope, $scope, $window, $http, Sockets, DeckAndSlides, dmPlayer) {
    DeckAndSlides.inContextOf('slide').slide.then(function (slide) {
      $scope.slide = slide;
      dmPlayer.setRecorderSource($scope.recorderSlide);
    });

    $scope.$on('slide', function (ev, slide_content) {
      $scope.slide.content = slide_content;
    });

  });

  bootstrap();
});
