require(['config'], function() {
    require(["decks/" + slides,
        "slider/slider",
        "slider/slider.plugins",
        "directives/layout-loader",
        "directives/plugins-loader",
        "plugins/deck-layout/deck-layout",
        "plugins/deck-navbar/deck-navbar",
        "plugins/deck-slides/deck-slides",
        "services/Sockets"
    ], function(deck, slider, sliderPlugins) {

        slider.controller('SliderCtrl', ['$rootScope', '$scope', 'Sockets',
            function($rootScope, $scope, Sockets) {
                $scope.deck = deck;
                $scope.$on('deck', function(ev, newDeck) {
                    $scope.deck = newDeck;
                });
                $scope.modes = ['deck'];
                if ($rootScope.editMode) {
                    $scope.modes.push('deck.edit');
                }
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