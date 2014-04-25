define(['module', 'slider/slider.plugins'], function(module, plugins) {
    var path = plugins.extractPath(module);

    plugins.directive('presentationLayoutStd', [
        function() {
            return {
                restrict: 'E',
                scope: {
                    deck: '=data',
                    editMode: '=extra'
                },
                templateUrl: path + '/presentation-layout-std.html',
                controller: ['$rootScope', '$scope', '$location',
                    function($rootScope, $scope, $location) {
                        $rootScope.title = $scope.deck.title;

                        $scope.changeSlide = function () {
                            var previousSlide = $scope.activeSlide;
                            $scope.activeSlide = $location.url().substr(1);
                            var absUrl = $location.absUrl();
                            var path = absUrl.substr(0, absUrl.indexOf('#'));
                            $scope.slideSource = path + ($scope.editMode ? '/edit:' : '/') + 'slide-' + $scope.activeSlide;
                            plugins.trigger('slide.current.change', $scope.activeSlide, previousSlide);
                        };

                        $scope.changeSlide();
                        $scope.$on('$locationChangeSuccess', $scope.changeSlide);
                    }
                ]
            };
        }
    ]);
});
