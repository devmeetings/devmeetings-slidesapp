/* globals define */
define([
  'slider/slider',
  'slider/slider.plugins',
  'slider/bootstrap',
  'services/DeckAndSlides',
  'directives/plugins-loader'
], function (slider, sliderPlugins, bootstrap) {
  slider.controller('TrainerCtrl', ['$scope', '$window', 'DeckAndSlides',

    function ($scope, $window, DeckAndSlides) {
      DeckAndSlides.inContextOf('deck').deck.then(function (deck) {
        $scope.deck = deck;
      });
      DeckAndSlides.inContextOf('deck').slides.then(function (slides) {
        $scope.slide = slides[0];
      });
    }
  ]);

  bootstrap();
});
