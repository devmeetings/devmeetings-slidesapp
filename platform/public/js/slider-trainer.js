require(['config', '/plugins/paths'], function(config, plugins) {
    require(["decks/" + slides, "slider/slider", "slider/slider.plugins",
        "directives/layout-loader", "directives/plugins-loader",
        "services/Sockets"
    ].concat(plugins), function(deck, slider, sliderPlugins) {

        slider.controller('TrainerCtrl', ['$scope', '$window',
            function($scope, $window) {
                $scope.slide = deck.slides[0];
            }
        ]);

        angular.bootstrap(document, ["slider"]);
        // TODO shitty
        setTimeout(function() {
            sliderPlugins.trigger('load');
        }, 200);
    });
});
