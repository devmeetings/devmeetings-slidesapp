require(['config'], function() {
    require(["data", "slider/slider", "slider/slider.plugins",
        "directives/layout-loader", "directives/plugins-loader",
        "plugins/slide-text/slide-text", "plugins/slide-title/slide-title", "plugins/slide-code/slide-code",
        "plugins/slide-jsrunner/slide-jsrunner", "plugins/slide-jsonOutput/slide-jsonOutput",
        "plugins/slide-jsmicrotasks/jsmicrotasks", "plugins/slide-fiddle/fiddle",
        "plugins/slide-task/slide-task"
    ], function(deck, slider, sliderPlugins) {

        slider.controller('SlideCtrl', ['$scope',
            function($scope) {
                $scope.$watch('slideId', function() {
                    $scope.slide = deck.slides.filter(function(s) {
                        return s.id === $scope.slideId;
                    })[0];
                });
            }
        ]);

        angular.bootstrap(document, ["slider"]);
        // TODO shitty
        setTimeout(function() {
            sliderPlugins.trigger('load');
        }, 200);
    });
});