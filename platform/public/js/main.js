define(["data", "slider", "directives/layout-loader", "plugins/presentation-layout-std/presentation-layout-std"], function(slides, slider) {

    slider.controller('SlidesDisplayCtrl', ['$scope',
        function($scope) {
            $scope.slides = slides.slides;
        }
    ]);

    angular.bootstrap(document, ["slider"]);
});