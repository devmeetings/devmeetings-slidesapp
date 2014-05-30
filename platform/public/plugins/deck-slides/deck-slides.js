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

                link: function($scope) {

                    sliderPlugins.listen($scope, 'slide.current.change', function(activeSlide) {
                        var absUrl = $location.absUrl();
                        var len = (absUrl.indexOf("/?") > -1 || absUrl.indexOf("?") > -1) ? absUrl.indexOf("?") : absUrl.indexOf("#");
                        var path = absUrl.substr(0, len);
                        $scope.slideSource = path.replace(/\/$/, '') + '/slide-' + activeSlide + ($rootScope.editMode ? '?edit=true' : '');
                    });

                }
            };
        }
    ]);

});
