define(["data", "slider", "directives/layout-loader", "plugins/presentation-layout-std/presentation-layout-std"], function(deck, slider) {

    slider.controller('SliderCtrl', ['$scope',
        function($scope) {
            $scope.deck = deck;
        }
    ]);

    angular.bootstrap(document, ["slider"]);
});