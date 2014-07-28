define(['module', '_', 'slider/slider', 'slider/slider.plugins'], function(module, _, slider, sliderPlugins) {

    var path = sliderPlugins.extractPath(module);

    slider.directive('sidebarControl', [

        function() {

            return {
                restrict: 'E',
                scope: {
                    splitter: '='
                },
                templateUrl: path + '/sidebar-control.html',

                link: function($scope) {
                    $scope.maxSize = 12;

                    var sizes = [6, 7, 8, 9, 10, 11, 12];
                    var lastSize = $scope.splitter.size;

                    $scope.toggleSize = function() {
                        var currentSizeIdx = sizes.indexOf(lastSize);
                        var nextSizeIdx = (currentSizeIdx + 1) % sizes.length;
                        lastSize = sizes[nextSizeIdx];

                        $scope.splitter.size = lastSize;
                    };

                    $scope.toggle = function() {
                        if ($scope.splitter.size !== $scope.maxSize) {
                            $scope.splitter.size = $scope.maxSize;
                        } else {
                            if (lastSize === $scope.maxSize) {
                                lastSize = sizes[0];
                            }
                            $scope.splitter.size = lastSize;
                        }
                    };
                }
            };
        }
    ]);

});