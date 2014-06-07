define(['module', '_', 'slider/slider.plugins', 'services/CurrentSlideManager', 'services/DeckAndSlides'], function(module, _, sliderPlugins, CurrentSlideManager, DeckAndSlides) {

    var path = sliderPlugins.extractPath(module);

    sliderPlugins.registerPlugin('deck', '*', 'deck-navbar', 1).directive('deckNavbar', [
        '$rootScope', '$location', '$http', 'CurrentSlideManager', 'DeckAndSlides', 'Sockets',
        function($rootScope, $location, $http, CurrentSlideManager, DeckAndSlides, Sockets) {

            return {
                restrict: 'E',
                scope: {
                    context: '=context'
                },
                templateUrl: path + '/deck-navbar.html',

                link: function(scope) {
                    scope.csm = CurrentSlideManager;

                    Sockets.on('slide.trainer.change_slide', function(slideId){
                        scope.$apply(function(){
                            $location.path(slideId);
                        });
                    });

                    DeckAndSlides.slides.then(function(slides) {
                        scope.slides = slides;
                    });
                    DeckAndSlides.deck.then(function(deck) {
                        scope.deck = deck;
                    });

                    scope.sortableOptions = {
                        stop: function(em, ui) {
                            // elements are already sorted here
                            scope.deck.slides = _.pluck(scope.slides, '_id');
                            $http.put('/api/decks/' + scope.deck._id, scope.deck);
                        }
                    };

                    scope.addSlide = function() {
                        // Update deck
                        var newSlide = {
                            name: 'New slide'
                        };

                        $http.post('/api/slides', newSlide).success( function (data, status) {
                            scope.slides = scope.slides.concat({
                                content: newSlide,
                                _id: data
                            });
                            scope.deck.slides = scope.deck.slides.concat(data);
                            $http.put('/api/decks/' + scope.deck._id, scope.deck);
                        });
                    };
                }
            };
        }
    ]);

});
