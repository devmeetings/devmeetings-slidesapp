define(['slider/slider.plugins'], function(sliderPlugins) {
    sliderPlugins.factory('DeckAndSlides', ['$q', function($q) {

        var asPromise = function(path) {
            var result = $q.defer();
            require([path], function(promiseResult) {
                result.resolve(promiseResult);
            });
            return result.promise;
        };
            
        return {
            deck: asPromise('require/decks/' + slides),
            slides: asPromise('require/decks/' + slides + '/slides')
        };
    }]);
});

