require(['config', '/require/plugins/paths'], function(config, plugins) {
    require(["require/decks/" + slides,
        "require/decks/" + slides + "/slides",
        "slider/slider",
        "slider/slider.plugins",
        "directives/layout-loader",
        "directives/plugins-loader",
        "directives/splitter",
        "directives/sidebar-control/sidebar-control",
        "services/Sockets"].concat(plugins), function(deck, deckSlides, slider, sliderPlugins) { 
            slider.controller('SliderCtrl', ['$rootScope', '$scope',
            function($rootScope, $scope) {
                console.log(deck);
                console.log("slides", deck.slides);
                console.log(deckSlides);
                $scope.deck = deck;
                $scope.deckSlides = deckSlides;

                $scope.$on('deck', function(ev, newDeck) {
                    $scope.deck = newDeck;
                });

                $scope.modes = ['deck'];
                if ($rootScope.editMode) {
                    $scope.modes.push('deck.edit');
                }
            }
        ]);

        angular.bootstrap(document, ["slider"]);
        // TODO shitty
        setTimeout(function() {
            sliderPlugins.trigger('load');
        }, 200);
    });
});
