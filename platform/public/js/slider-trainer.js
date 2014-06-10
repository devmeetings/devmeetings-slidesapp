require([
    "slider/slider",
    "slider/slider.plugins",
    "slider/bootstrap",
    "services/DeckAndSlides",
    "services/Sockets",
    "directives/plugins-loader"
], function(slider, sliderPlugins, bootstrap) {

    slider.controller('TrainerCtrl', ['$scope', '$window', 'DeckAndSlides',

        function($scope, $window, DeckAndSlides) {

            DeckAndSlides.deck.then(function(deck) {
                $scope.deck = deck;
            });
            DeckAndSlides.slides.then(function(slides) {
                $scope.slide = slides[0];
            });

        }
    ]);

    bootstrap();
});