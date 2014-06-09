define(['slider/slider.plugins'], function(sliderPlugins) {
    sliderPlugins.factory('DeckAndSlides', ['$q',
        function($q) {

            var asPromise = function(path) {
                var result = $q.defer();
                require([path], function(promiseResult) {
                    result.resolve(promiseResult);
                });
                return result.promise;
            };
            var deckAndSlides = {
                deck: asPromise('require/decks/' + slides),
                slides: asPromise('require/decks/' + slides + '/slides')
            };

            // Add current slide
            if (typeof slideId !== 'undefined') {
                deckAndSlides.currentSlide = asPromise('require/slides/' + slideId);
            }

            return deckAndSlides;
        }
    ]);
});