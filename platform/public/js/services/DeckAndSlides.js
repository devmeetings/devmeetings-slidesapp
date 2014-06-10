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

            var addCurrentSlide = function(das) {
                // Add current slide
                if (typeof slideId !== 'undefined') {
                    das.currentSlide = asPromise('require/slides/' + slideId);
                }
            };

            var das = {
                deck: asPromise('require/decks/' + slides),
                slides: asPromise('require/decks/' + slides + '/slides')
            };

            addCurrentSlide(das);

            return das;
        }
    ]);
});