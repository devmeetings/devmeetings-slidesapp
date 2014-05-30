 define(['slider/slider.plugins', 'services/DeckAndSlides', 'services/Sockets'], function(sliderPlugins) {
    sliderPlugins.factory('CurrentSlideManager', ['$rootScope', '$location', 'Sockets', 'DeckAndSlides', function( $rootScope, $location, Sockets, DeckAndSlides) {
        
        var csm = {
            activeSlideId: 0
        };

        DeckAndSlides.deck.then( function(deck) {
            csm.activeSlideId = deck.slides[0];
        });

        Sockets.forwardEventToServer('slide.current.change');

        $rootScope.$on('$locationChangeSuccess', function() {
            var previousSlideId = csm.activeSlideId;
            csm.activeSlideId = $location.url().substr(1);
            if (!csm.activeSlideId) {
                console.log("err >> no active slide!");
            } else {
                sliderPlugins.trigger('slide.current.change', csm.activeSlideId, previousSlideId);
            }
        });

        return csm; 
    }]);
 });
