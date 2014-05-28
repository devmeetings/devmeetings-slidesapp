define(['module', '_', 'slider/slider.plugins'], function(module, _, sliderPlugins) {

    var path = sliderPlugins.extractPath(module);

    sliderPlugins.registerPlugin('deck', 'slides', 'deck-navbar', 1).directive('deckNavbar', [
        '$rootScope', '$location', '$http', 'Sockets',
        function($rootScope, $location, $http, Sockets) {

            Sockets.forwardEventToServer('slide.current.change');

            return {
                restrict: 'E',
                scope: {
                    slides: '=data',
                    deck: '=context'
                },
                templateUrl: path + '/deck-navbar.html',

                link: function($scope) {
                    $rootScope.title = $scope.deck.title;

                    $scope.changeSlide = function() {
                        var previousSlide = $scope.activeSlide;
                        $scope.activeSlide = $location.url().substr(1);
                        sliderPlugins.trigger('slide.current.change', $scope.activeSlide, previousSlide);
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