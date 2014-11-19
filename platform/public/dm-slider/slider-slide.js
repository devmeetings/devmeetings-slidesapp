require([
    'templates',
    "slider/slider",
    "slider/slider.plugins",
    "slider/bootstrap",
    "services/DeckAndSlides",
    "directives/plugins-loader",
], function(templates, slider, sliderPlugins, bootstrap) {

    slider.controller('SlideCtrl', ['$rootScope', '$scope', '$window', '$http', 'Sockets', 'DeckAndSlides',
        function($rootScope, $scope, $window, $http, Sockets, DeckAndSlides) {

            DeckAndSlides.inContextOf('slide').slide.then(function(slide) {
                $scope.slide = slide;
            });

            $scope.$on('slide', function(ev, slide_content) {
                $scope.slide.content = slide_content;
            });
        }
    ]);

    bootstrap();
});
