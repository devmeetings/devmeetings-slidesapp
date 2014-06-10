define(['module', '_', 'slider/slider.plugins', 'services/CurrentSlideManager'], function(module, _, sliderPlugins, CurrentSlideManager) {

    var path = sliderPlugins.extractPath(module);

    sliderPlugins.registerPlugin('deck', 'slides', 'deck-slides').directive('deckSlides', [
        '$timeout', '$rootScope', 'CurrentSlideManager',
        function($timeout, $rootScope, CurrentSlideManager) {

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

                    scope.csm = CurrentSlideManager;
                    scope.$watch('csm.activeSlideId', onSlideChange);

                    // refresh size
                    element.find('iframe').on('load', function() {
                        var frame = this;
                        $timeout(function() {
                            var innerBody = frame.contentWindow.document.body;
                            frame.style.height = Math.max(700, innerBody.scrollHeight + 100, innerBody.offsetHeight + 100) + 'px';
                        }, 1000);
                    });
                }
            };
        }
    ]);

});