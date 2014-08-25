require([
    'templates',
    "slider/slider",
    "slider/slider.plugins",
    "slider/bootstrap",
    "services/DeckAndSlides",
    "services/Sockets",
    "directives/layout-loader",
    "directives/plugins-loader",
    "directives/splitter",
    "directives/sidebar-control/sidebar-control"
], function(templates, slider, sliderPlugins, bootstrap) {
    slider.controller('SliderCtrl', ['$rootScope', '$scope', 'DeckAndSlides',

        function($rootScope, $scope, DeckAndSlides) {

            DeckAndSlides.inContextOf('deck').deck.then(function(deck) {
                $scope.deck = deck;
            });
            DeckAndSlides.inContextOf('deck').slides.then(function(deckSlides) {
                $scope.deckSlides = deckSlides;
            });

            $scope.$on('deck', function(ev, newDeck) {
                $scope.deck = newDeck;
            });
        }
    ]);

    bootstrap();
});