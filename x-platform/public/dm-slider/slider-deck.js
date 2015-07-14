/* globals define */
define([
  'slider/slider',
  'slider/slider.plugins',
  'slider/bootstrap',
  'services/DeckAndSlides',
  'directives/layout-loader',
  'directives/plugins-loader',
  'directives/contenteditable',
  'directives/sidebar-control/sidebar-control'
], function (slider, sliderPlugins, bootstrap) {
  slider.controller('SliderCtrl', function ($rootScope, $scope, DeckAndSlides, dmPlayer) {
    function updateDeck (deck) {
      $scope.deck = deck;
      $scope.deck.deckSlides = $scope.deckSlides;
    }

    DeckAndSlides.inContextOf('deck').deck.then(updateDeck);

    DeckAndSlides.inContextOf('deck').slides.then(function (deckSlides) {
      $scope.deckSlides = deckSlides;
      updateDeck($scope.deck || {});
      dmPlayer.setRecorderSource($scope.recorderDeck);
    });

    $scope.$on('deck', function (ev, newDeck) {
      updateDeck($scope.deck);
    });

  });

  bootstrap();
});
