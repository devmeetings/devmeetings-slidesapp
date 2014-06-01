define(['module', '_', 'slider/slider.plugins', 'services/CurrentSlideManager', 'services/DeckAndSlides'], function(module, _, sliderPlugins, CurrentSlideManager, DeckAndSlides) {

    var path = sliderPlugins.extractPath(module);

    sliderPlugins.registerPlugin('deck', '*', 'deck-navbar', 1).directive('deckNavbar', [
        '$rootScope', '$location', '$http', 'CurrentSlideManager', 'DeckAndSlides',
        function($rootScope, $location, $http, CurrentSlideManager, DeckAndSlides) {

            return {
                restrict: 'E',
                scope: {
                    slides: '=context'
                },
                templateUrl: path + '/deck-navbar.html',

                link: function(scope) {
                    scope.csm = CurrentSlideManager;
                    DeckAndSlides.slides.then( function(slides) {
                        scope.slides = slides;
                    });
                    /*$scope.addSlide = function() {
                        // Update deck
                        $scope.deck.slides.push({
                            id: 'empty' + new Date(),
                            name: 'New slide'
                        });
                        // TODO [ToDr] TEMP hack
                        $http.put('/api/decks/' + slides, $scope.deck);
                    };
                    */
                }
            };
        }
    ]);

});
