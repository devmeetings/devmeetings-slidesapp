require([
    'templates',
    "slider/slider",
    "slider/slider.plugins",
    "slider/bootstrap",
    "services/DeckAndSlides",
    "directives/layout-loader",
    "directives/plugins-loader",
    "directives/splitter",
    "directives/contenteditable",
    "directives/sidebar-control/sidebar-control"
], function(templates, slider, sliderPlugins, bootstrap) {
    slider.controller('SliderCtrl', ['$rootScope', '$scope', 'DeckAndSlides',

        function($rootScope, $scope, DeckAndSlides) {

            function updateDeck(deck) {
                $scope.deck = deck;
                $scope.deck.deckSlides = $scope.deckSlides;
            }

            DeckAndSlides.inContextOf('deck').deck.then(updateDeck);

            DeckAndSlides.inContextOf('deck').slides.then(function(deckSlides) {
                $scope.deckSlides = deckSlides;
                updateDeck($scope.deck || {});
            });

            $scope.$on('deck', function(ev, newDeck) {
                updateDeck($scope.deck);
            });
        }
    ]);

    bootstrap();
});