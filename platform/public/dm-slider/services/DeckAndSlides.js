define(['slider/slider.plugins'], function(sliderPlugins) {
    sliderPlugins.factory('DeckAndSlides', ['$q',
        function($q) {

            /* TODO [ToDr] Rethink and merge CurrentSlideManagerForDeck & DeckAndSlides ? */
            var asPromise = function(path) {
                var result = $q.defer();
                require([path], function(promiseResult) {
                    result.resolve(promiseResult);
                });
                return result.promise;
            };

            return {
                deckId: (typeof slides === 'undefined') ? null : slides,
                slideId: (typeof slideId === 'undefined') ? null : slideId,
                // TODO [ToDr] Fix this when plugins loading is splitted2
                isDeckContext: function() {
                    return this.deckId !== null;
                },
                _deck: function() {
                    return {
                        deckId: slides,
                        deck: asPromise('require/decks/' + slides),
                        slides: asPromise('require/decks/' + slides + '/slides')
                    };
                },
                _slide: function() {
                    return {
                        deckId: this.deckId,
                        slideId: slideId,
                        slide: asPromise('require/slides/' + slideId)
                    };
                },
                inContextOf: function(context) {
                    if (context === 'deck') {
                        return this._deck();
                    }

                    if (context === 'slide') {
                        return this._slide();
                    }
                }
            };
        }
    ]);
});