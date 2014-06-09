require([
    "slider/slider",
    "slider/slider.plugins",
    "slider/bootstrap",
    "services/DeckAndSlides",
    "services/Sockets",
    "directives/layout-loader",
    "directives/plugins-loader",
    "directives/splitter",
    "directives/sidebar-control/sidebar-control"
], function(slider, sliderPlugins, bootstrap) {
    slider.controller('SliderCtrl', ['$rootScope', '$scope', 'DeckAndSlides',

        function($rootScope, $scope, DeckAndSlides) {

            DeckAndSlides.deck.then(function(deck) {
                $scope.deck = deck;
            });
            DeckAndSlides.slides.then(function(deckSlides) {
                $scope.deckSlides = deckSlides;
            });

            $scope.$on('deck', function(ev, newDeck) {
                $scope.deck = newDeck;
            });

            $scope.modes = ['deck'];
            if ($rootScope.editMode) {
                $scope.modes.push('deck.edit');
            }
        }
    ]);

    bootstrap();
});