require(['config', '/require/plugins/paths'], function(config, plugins) {
    require(["require/slides/" + slideId,
        "slider/slider",
        "slider/slider.plugins",
        "directives/layout-loader", "directives/plugins-loader",
        "directives/contenteditable"].concat(plugins), function(slide, slider, sliderPlugins) {

        slider.controller('SlideCtrl', ['$rootScope', '$scope', '$window', '$http', 'Sockets',
            function($rootScope, $scope, $window, $http, Sockets) {
                $scope.$on('slide', function(ev, slide_content) {
                    $scope.slide = slide_content;
                    slide.content = slide_content;
                    Sockets.emit('slide.edit.put', slide);
                });

                $scope.slide = slide.content;
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
