require(['config'], function() {
    require(["data", "slider/slider", "slider/slider.plugins", "directives/layout-loader", "plugins/presentation-layout-std/presentation-layout-std"], function(deck, slider, sliderPlugins) {

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