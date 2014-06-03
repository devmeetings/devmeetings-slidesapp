define(['module', '_', 'slider/slider.plugins', 'services/CurrentSlideManager'], function(module, _, sliderPlugins, CurrentSlideManager) {

    var path = sliderPlugins.extractPath(module);

    sliderPlugins.registerPlugin('deck', 'slides', 'deck-slides').directive('deckSlides', [
        '$location', '$rootScope', 'CurrentSlideManager',
        function($location, $rootScope, CurrentSlideManager) {

            return {
                restrict: 'E',
                scope: {
                    slides: '=data',
                    deck: '=context'
                },
                templateUrl: path + '/deck-slides.html',

                link: function(scope) {
                    var onSlideChange = function(activeSlideId) {
                        var absUrl = $location.absUrl();
                        var len = (absUrl.indexOf("/?") > -1 || absUrl.indexOf("?") > -1) ? absUrl.indexOf("?") : absUrl.indexOf("#");
                        var path = len != -1 ? absUrl.substr(0, len) : absUrl;
                        scope.slideSource = path.replace(/\/$/, '') + '/slide-' + activeSlideId + ($rootScope.editMode ? '?edit=true' : '');
                    };

                    scope.csm = CurrentSlideManager;
                    scope.$watch('csm.activeSlideId', onSlideChange);
                }
            };
        }
    ]);

});