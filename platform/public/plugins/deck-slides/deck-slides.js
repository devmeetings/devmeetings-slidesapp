define(['module', '_', 'slider/slider.plugins'], function(module, _, sliderPlugins) {

    var path = sliderPlugins.extractPath(module);

    sliderPlugins.registerPlugin('deck', 'slides', 'deck-slides').directive('deckSlides', [

        function() {

            return {
                restrict: 'E',
                scope: {
                    slides: '=data',
                    deck: '=context'
                },
                templateUrl: path + '/deck-slides.html',

                controller: ['$rootScope', '$scope', '$location',
                    function($rootScope, $scope, $location) {

                        sliderPlugins.listen($scope, 'slide.current.change', function(activeSlide) {
                            var absUrl = $location.absUrl();
                            var len = (absUrl.indexOf("/?") > -1 || absUrl.indexOf("?") > -1) ? absUrl.indexOf("?") : absUrl.indexOf("#");
                            var path = absUrl.substr(0, len);
                            $scope.slideSource = path.replace(/\/$/, '') + '/slide-' + activeSlide + ($rootScope.editMode ? '?edit=true' : '');
                        });

                    }
                ]
            };
        }
    ]);

});