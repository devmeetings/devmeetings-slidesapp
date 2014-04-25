require(['config'], function() {
    require(["decks/"+slides, "slider/slider", "slider/slider.plugins",
        "directives/layout-loader", "directives/plugins-loader",
        "plugins/slide-text/slide-text", "plugins/slide-title/slide-title", "plugins/slide-code/slide-code",
        "plugins/slide-jsrunner/slide-jsrunner", "plugins/slide-jsonOutput/slide-jsonOutput",
        "plugins/slide-jsmicrotasks/jsmicrotasks", "plugins/slide-fiddle/fiddle",
        "plugins/slide-task/slide-task", "plugins/slide-leftRight/slide-leftRight",
        "plugins/slide-accordion/slide-accordion", "plugins/slide-chat/slide-chat"
    ], function(deck, slider, sliderPlugins) {

        slider.controller('SlideCtrl', ['$scope', '$window',
            function($scope, $window) {
                $window.parent.addEventListener('message', function(ev) {
                    deck = ev.data.data;
                    $scope.$apply(updateSlide);
                });
                var updateSlide = function() {
                    var newSlide = deck.slides.filter(function(s) {
                        return s.id === $scope.slideId;
                    })[0];
                    $scope.slide = newSlide;
                };
                $scope.$watch('slideId', updateSlide);
            }
        ]);

        angular.bootstrap(document, ["slider"]);
        // TODO shitty
        setTimeout(function() {
            sliderPlugins.trigger('load');
        }, 200);
    });
});
