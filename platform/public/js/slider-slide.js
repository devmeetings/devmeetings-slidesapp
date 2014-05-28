require(['config', '/require/plugins/paths'], function(config, plugins) {
    require(["require/decks/" + slides,
        "require/decks/" + slides + "/slides",
        "slider/slider",
        "slider/slider.plugins",
        "services/SlideInfo",
        "directives/layout-loader", "directives/plugins-loader",
        "directives/contenteditable"].concat(plugins), function(deck, deckSlides, slider, sliderPlugins) {

        slider.controller('SlideCtrl', ['$rootScope', '$scope', '$window', '$http', 'SlideInfo',
            function($rootScope, $scope, $window, $http, SlideInfo) {
                $scope.$on('slide', function(ev, slide) {
                    var lastSlide = $scope.slide;
                    $scope.slide = slide;
                    // Update deck
                    $http.put('/api/slides/' + slide._id, slide); 
                    //deck.slides[deck.slides.indexOf(lastSlide)] = slide;
                    //$http.put('/api/decks/' + slides, deck);
                });

                var updateSlide = function() {
                    var newSlide = deck.slides.filter(function(s) {
                        return s.id === $scope.slideId;
                    })[0];
                    $scope.slide = newSlide;

                    SlideInfo.presentation = slides;
                    SlideInfo.slide = newSlide.id;
                };

                $scope.$watch('slideId', updateSlide);
                $scope.modes = [{
                    namespace: 'slide',
                    refresh: true
                }];
                if ($rootScope.editMode) {
                    $scope.modes.unshift({
                        namespace: 'slide.edit',
                        refresh: false
                    });
                }
            }
        ]);

        angular.bootstrap(document, ["slider"]);
        // TODO shitty
        setTimeout(function() {
            sliderPlugins.trigger('load');
        }, 200);
    });
});
