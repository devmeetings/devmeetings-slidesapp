define(['module', '_', 'slider/slider.plugins', 'services/CurrentSlideManagerForDeck'], function(module, _, sliderPlugins) {

    var path = sliderPlugins.extractPath(module);

    sliderPlugins.registerPlugin('deck', 'slides', 'deck-slides').directive('deckSlides', [
        '$timeout', '$rootScope', 'CurrentSlideManagerForDeck',
        function($timeout, $rootScope, CurrentSlideManagerForDeck) {

            return {
                restrict: 'E',
                scope: {
                    slides: '=data',
                    deck: '=context'
                },
                templateUrl: path + '/deck-slides.html',

                link: function(scope, element) {
                    var onSlideChange = function(activeSlideId) {
                        scope.slideSource = '/slides/' + activeSlideId + ($rootScope.editMode ? '?edit=true' : '');
                    };

                    scope.csm = CurrentSlideManagerForDeck;
                    scope.$watch('csm.activeSlideId', onSlideChange);

                }
            };
        }
    ]);

});