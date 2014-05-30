define(['slider/slider.plugins'], function(sliderPlugins) {
    sliderPlugins.factory('DeckAndSlides', ['$q', function($q) {
        var d1 = $q.defer();
        require(['require/decks/' + slides], function(deck){
            d1.resolve(deck);
        }); 
        
        var d2 = $q.defer();
        require(['require/decks/' + slides + '/slides'], function(deckSlides){
            d2.resolve(deckSlides);
        });
            
        return {
            deck: d1.promise,
            slides: d2.promise
        };
    }]);
});

