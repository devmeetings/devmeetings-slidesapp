define(['module', '_', 'slider/slider.plugins', 'services/CurrentSlideManagerForDeck', 'services/DeckAndSlides'], function(module, _, sliderPlugins, CurrentSlideManagerForDeck, DeckAndSlides) {

    var path = sliderPlugins.extractPath(module);

    sliderPlugins.registerPlugin('deck', '*', 'deck-navbar', 1).directive('deckNavbar', [
        '$rootScope', '$location', '$http', 'CurrentSlideManagerForDeck', 'DeckAndSlides', 'Sockets',
        function($rootScope, $location, $http, CurrentSlideManagerForDeck, DeckAndSlides, Sockets) {

            return {
                restrict: 'E',
                scope: {
                    context: '=context'
                },
                templateUrl: path + '/deck-navbar.html',

                link: function(scope) {
                    scope.csm = CurrentSlideManagerForDeck;
                    scope.deckUrl = '/decks/' + DeckAndSlides.deckId;

                    Sockets.on('slide.trainer.change_slide', function(slideId) {
                        scope.$apply(function() {
                            $location.path(slideId);
                        });
                    });

                    DeckAndSlides.inContextOf('deck').slides.then(function(slides) {
                        scope.slides = slides;
                    });
                    DeckAndSlides.inContextOf('deck').deck.then(function(deck) {
                        scope.deck = deck;
                    });

                    scope.sortableOptions = {
                        stop: function(em, ui) {
                            // elements are already sorted here
                            scope.deck.slides = _.pluck(scope.slides, '_id');
                            $http.put('/api/decks/' + scope.deck._id, scope.deck);
                        }
                    };


                    scope.cloneSlide = function() {
                        var slideId = CurrentSlideManagerForDeck.activeSlideId;
                        var clone = _.find(scope.deck.deckSlides, {
                            _id: slideId
                        });

                        postSlide(JSON.parse(JSON.stringify(clone.content)));
                    };

                    scope.addSlide = function() {
                        // Update deck
                        var newSlide = {
                            name: 'New slide',
                            title: 'New slide'
                        };

                        postSlide(newSlide);
                    };


                    function postSlide(newSlide) {
                        $http.post('/api/slides', newSlide).success(function(data, status) {
                            var newSlideData = [{
                                content: newSlide,
                                _id: data[0]
                            }];
                            var deck = scope.deck;

                            scope.slides = scope.slides.concat(newSlideData);
                            deck.slides = deck.slides.concat(data);
                            deck.deckSlides = deck.deckSlides.concat(newSlideData);
                            
                            $http.put('/api/decks/' + deck._id, deck);
                        });
                    }
                }
            };
        }
    ]);

});