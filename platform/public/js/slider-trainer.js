require(['config'], function() {
    require(["decks/"+slides, "slider/slider", "slider/slider.plugins",
        "directives/layout-loader", "directives/plugins-loader", "plugins/trainer-notes/trainer-notes"
    ], function(deck, slider, sliderPlugins) {

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