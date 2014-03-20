require(['config'], function() {
    require(["data", "slider/slider", "directives/layout-loader", "directives/plugins-loader", "plugins/slide-text/slide-text", "plugins/slide-title/slide-title"], function(deck, slider) {

        slider.controller('SlideCtrl', ['$scope',
            function($scope) {
                $scope.slide = deck.slides[0];
            }
        ]);

        angular.bootstrap(document, ["slider"]);
    });
});