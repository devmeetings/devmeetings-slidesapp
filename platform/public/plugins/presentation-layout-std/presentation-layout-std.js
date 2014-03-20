define(['module', 'slider.plugins'], function(module, plugins) {
    var path = plugins.extractPath(module);


    plugins.directive('presentationLayoutStd', [

        function() {
            return {
                restrict: 'E',
                scope: {
                    deck: '=data'
                },
                templateUrl: path + '/presentation-layout-std.html',
                controller: ['$rootScope', '$scope', '$location',
                    function($rootScope, $scope, $location) {
                        $rootScope.title = $scope.deck.title;
                        $scope.$on('$locationChangeSuccess', function() {
                            $scope.activeSlide = $location.url().substr(1);
                            $scope.slideSource = $scope.activeSlide;
                        });
                    }
                ]
            }
        }
    ]);

});