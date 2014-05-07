require(['config'], function() {
    require(["decks/" + slides,
        "slider/slider",
        "slider/slider.plugins",
        "directives/layout-loader",
        "directives/plugins-loader",
        "plugins/presentation-layout-std/presentation-layout-std",
        "plugins/deck-layout/deck-layout",
        "services/Sockets"
    ], function(deck, slider, sliderPlugins) {

        slider.controller('SliderCtrl', ['$scope', 'Sockets',
            function($scope, Sockets) {
                $scope.deck = deck;
                $scope.$on('deck', function(ev, newDeck) {
                    $scope.deck = newDeck;
                });
                Sockets.emit('deck.current', deck._id);
            }
        ]);

        angular.bootstrap(document, ["slider"]);
        // TODO shitty
        setTimeout(function() {
            sliderPlugins.trigger('load');
        }, 200);
    });
});