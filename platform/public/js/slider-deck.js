require(['config'], function() {
    require(["decks/"+slides, "slider/slider", "slider/slider.plugins", "directives/layout-loader", "directives/plugins-loader",
        "plugins/presentation-layout-std/presentation-layout-std",
        "plugins/deck-layout/deck-layout"], function(deck, slider, sliderPlugins) {

        slider.controller('SliderCtrl', ['$scope',
            function($scope) {
                $scope.deck = deck;
            }
        ]);

        angular.bootstrap(document, ["slider"]);
        // TODO shitty
        setTimeout(function() {
            sliderPlugins.trigger('load');
        }, 200);
    });
});