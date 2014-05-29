require(['config', '/require/plugins/paths'], function(config, plugins) {
    require(["require/slides/" + slideId,
        "slider/slider",
        "slider/slider.plugins",
        "directives/layout-loader", "directives/plugins-loader",
        "directives/contenteditable"].concat(plugins), function(slide, slider, sliderPlugins) {

        slider.controller('SlideCtrl', ['$rootScope', '$scope', '$window', '$http',
            function($rootScope, $scope, $window, $http) {
                /*$scope.$on('slide', function(ev, slide) {
                    var lastSlide = $scope.slide;
                    $scope.slide = slide;
                    // Update deck
                    $http.put('/api/slides/' + slide._id, slide); 
                    //deck.slides[deck.slides.indexOf(lastSlide)] = slide;
                    //$http.put('/api/decks/' + slides, deck);
                });

                */

                $scope.slide = slide.content;
                //$scope.$watch('slideId', updateSlide);
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
