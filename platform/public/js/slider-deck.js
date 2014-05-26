require(['config', '/decks/plugin_paths'], function(config, plugins) {
    require(["decks/" + slides,
        "slider/slider",
        "slider/slider.plugins",
        "directives/layout-loader",
        "directives/plugins-loader",
        "services/Sockets"].concat(plugins), function(deck, slider, sliderPlugins) { 

        slider.controller('SliderCtrl', ['$rootScope', '$scope',
            function($rootScope, $scope) {
                $scope.deck = deck;
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
