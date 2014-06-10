define(['slider/slider.plugins'], function(sliderPlugins) {
    sliderPlugins.factory('CurrentSlide', ['$q',
        function($q) {
        /* TODO [ToDr] Rethink and merge CurrentSlide & CurrentSlideManager & DeckAndSlides */
            var asPromise = function(path) {
                var result = $q.defer();
                require([path], function(promiseResult) {
                    result.resolve(promiseResult);
                });
                return result.promise;
            };

            return asPromise('require/slides/' + slideId);
        }
    ]);
});