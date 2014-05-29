define(['module', '_', 'slider/slider.plugins'], function(module, _, sliderPlugins) {

    var path = sliderPlugins.extractPath(module);

    sliderPlugins.registerPlugin('deck.slides', '*', 'deck-navbar', 1).directive('deckNavbar', [
        '$rootScope', '$location', '$http', 'Sockets',
        function($rootScope, $location, $http, Sockets) {

            Sockets.forwardEventToServer('slide.current.change');

            return {
                restrict: 'E',
                scope: {
                    slides: '=context'
                },
                templateUrl: path + '/deck-navbar.html',

                link: function($scope) {
                    $scope.changeSlide = function() {
                        var previousSlide = $scope.activeSlide;
                        $scope.activeSlide = $location.url().substr(1);
                        if (!$scope.activeSlide) {
                            var firstSlide = $scope.slides[0];
                            $location.url('/' + (firstSlide ? firstSlide._id : ''));
                        } else {
                            sliderPlugins.trigger('slide.current.change', $scope.activeSlide, previousSlide);
                        }
                    };

                    $scope.changeSlide();
                    $scope.$on('$locationChangeSuccess', $scope.changeSlide);

                    $scope.addSlide = function() {
                        // Update deck
                        $scope.deck.slides.push({
                            id: 'empty' + new Date(),
                            name: 'New slide'
                        });
                        // TODO [ToDr] TEMP hack
                        $http.put('/api/decks/' + slides, $scope.deck);
                    };
                }
            };
        }
    ]);

});
