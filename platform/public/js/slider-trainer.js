require(['config'], function() {
    require(["decks/" + slides, "slider/slider", "slider/slider.plugins",
        "directives/layout-loader", "directives/plugins-loader",
        "services/Sockets",
        "plugins/trainer-notes/trainer-notes",
        "plugins/trainer-participants/trainer-participants"
    ], function(deck, slider, sliderPlugins) {

        slider.controller('TrainerCtrl', ['$scope', '$window', 'Sockets',
            function($scope, $window, Sockets) {
                $scope.slide = deck.slides[0];

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