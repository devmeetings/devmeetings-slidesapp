require(['config'], function() {
    require(["data", "slider/slider",
        "directives/layout-loader", "directives/plugins-loader",
        "plugins/slide-text/slide-text", "plugins/slide-title/slide-title", "plugins/slide-code/slide-code",
        "plugins/slide-jsrunner/slide-jsrunner", "plugins/slide-jsonOutput/slide-jsonOutput"
    ], function(deck, slider) {

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
    });
});