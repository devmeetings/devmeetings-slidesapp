define(['module', '_', 'slider/slider.plugins', 'services/CurrentSlideManagerForDeck'], function(module, _, sliderPlugins) {

    var path = sliderPlugins.extractPath(module);

    sliderPlugins.registerPlugin('deck', 'slides', 'deck-slides').directive('deckSlides', [
        '$timeout', '$rootScope', 'CurrentSlideManagerForDeck', 'hotkeys',
        function($timeout, $rootScope, CurrentSlideManagerForDeck, hotkeys) {

            return {
                restrict: 'E',
                scope: {
                    slides: '=data',
                    deck: '=context'
                },
                templateUrl: path + '/deck-slides.html',

                link: function(scope, element) {
                    var onSlideChange = function(activeSlideId) {
                        scope.slide = _.find(scope.deck.deckSlides, {
                            _id: activeSlideId
                        });
                    };

                    scope.csm = CurrentSlideManagerForDeck;
                    scope.$watch('csm.activeSlideId', onSlideChange);


                    function fixSlideIdx(idx, maxLength) {
                        idx = idx % maxLength;

                        if (idx >= 0) {
                            return idx;
                        }
                        
                        return maxLength + idx;
                    }

                    function goToSlide(diff) {
                        var maxLength = scope.deck.deckSlides.length;
                        var idx = _.map(scope.deck.deckSlides, function(x) {
                            return x._id;
                        }).indexOf(scope.slide._id);

                        idx = fixSlideIdx(idx + diff, maxLength);
                        scope.slide = scope.deck.deckSlides[idx];
                    }

                    hotkeys.bindTo(scope).add({
                        combo: 'right',
                        description: 'Next slide',
                        callback: goToSlide.bind(null, 1)
                    }).add({
                        combo: 'left',
                        description: 'Previous slide',
                        callback: goToSlide.bind(null, -1)
                    });
                }
            };
        }
    ]);

});