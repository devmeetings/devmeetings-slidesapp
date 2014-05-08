require(['config'], function() {
    require(["decks/" + slides, "slider/slider", "slider/slider.plugins",
        "services/SlideInfo",
        "directives/layout-loader", "directives/plugins-loader",
        "plugins/slide-text/slide-text", "plugins/slide-title/slide-title", "plugins/slide-code/slide-code",
        "plugins/slide-jsrunner/slide-jsrunner", "plugins/slide-jsonOutput/slide-jsonOutput",
        "plugins/slide-jsmicrotasks/jsmicrotasks", "plugins/slide-fiddle/fiddle",
        "plugins/slide-task/slide-task", "plugins/slide-leftRight/slide-leftRight",
        "plugins/slide-accordion/slide-accordion", "plugins/slide-chat/slide-chat",
        "plugins/slide.edit-editor/slide.edit-editor", "plugins/slide-serverRunner/slide-serverRunner"
    ], function(deck, slider, sliderPlugins) {

        slider.controller('SlideCtrl', ['$rootScope', '$scope', '$window', '$http', 'SlideInfo',
            function($rootScope, $scope, $window, $http, SlideInfo) {
                $scope.$on('slide', function(ev, slide) {
                    var lastSlide = $scope.slide;
                    $scope.slide = slide;
                    // Update deck
                    deck.slides[deck.slides.indexOf(lastSlide)] = slide;
                    $http.put('/api/decks/' + slides, deck);
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