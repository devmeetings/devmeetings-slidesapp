define(['module', 'slider/slider.plugins'], function(module, plugins) {
    var path = plugins.extractPath(module);

    plugins.directive('presentationLayoutStd', ['$rootScope',
        function($rootScope) {
            return {
                restrict: 'E',
                scope: {
                    deck: '=data'
                },
                templateUrl: path + '/presentation-layout-std.html',
                controller: ['$rootScope', '$scope', '$location',
                    function($rootScope, $scope, $location) {
                        $rootScope.title = $scope.deck.title;

                        $scope.changeSlide = function() {
                            var previousSlide = $scope.activeSlide;
                            $scope.activeSlide = $location.url().substr(1);
                            var absUrl = $location.absUrl();
                            var len = absUrl.indexOf("?") > -1 ? absUrl.indexOf("?") : absUrl.indexOf("#");
                            var path = absUrl.substr(0, len);
                            $scope.slideSource = path + '/slide-' + $scope.activeSlide + ($rootScope.editMode ? '?edit=true' : '');
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