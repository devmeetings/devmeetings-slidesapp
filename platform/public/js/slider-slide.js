require([
    "slider/slider",
    "slider/slider.plugins",
    "slider/bootstrap",
    "services/CurrentSlide",
    "directives/plugins-loader",
    "directives/contenteditable"
], function(slider, sliderPlugins, bootstrap) {

    slider.controller('SlideCtrl', ['$rootScope', '$scope', '$window', '$http', 'Sockets', 'CurrentSlide',
        function($rootScope, $scope, $window, $http, Sockets, CurrentSlide) {

            CurrentSlide.then(function(slide) {
                $scope.slide = slide.content;
            });

            $scope.$on('slide', function(ev, slide_content) {
                $scope.slide = slide_content;
                Sockets.emit('slide.edit.put', slide);
            });

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

    bootstrap();
});