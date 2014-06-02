define(['module', '_', 'slider/slider.plugins', 'services/CurrentSlideManager', 'services/DeckAndSlides'], function(module, _, sliderPlugins, CurrentSlideManager, DeckAndSlides) {

    var path = sliderPlugins.extractPath(module);

    sliderPlugins.registerPlugin('deck', '*', 'deck-navbar', 1).directive('deckNavbar', [
        '$rootScope', '$location', '$http', 'CurrentSlideManager', 'DeckAndSlides',
        function($rootScope, $location, $http, CurrentSlideManager, DeckAndSlides) {

            return {
                restrict: 'E',
                scope: {
                    context: '=context'
                },
                templateUrl: path + '/deck-navbar.html',

                link: function(scope) {
                    scope.csm = CurrentSlideManager;
                    DeckAndSlides.slides.then(function (slides) {
                        scope.slides = slides;
                    });
                    DeckAndSlides.deck.then(function (deck) {
                        scope.deck = deck;
                    });

                    scope.addSlide = function() {
                        // Update deck
                        var newSlide = {
                            id: 'empty' + new Date(),
                            name: 'New slide'
                        };

                        $http.post('/api/slides', newSlide).success( function (data, status) {
                            scope.slides = scope.slides.concat(newSlide);
                            scope.deck.slides = scope.deck.slides.concat(data);
                            $http.put('/api/decks/' + scope.deck._id, scope.deck);
                        });
                    };
                }
            };
        }
    ]);

});
