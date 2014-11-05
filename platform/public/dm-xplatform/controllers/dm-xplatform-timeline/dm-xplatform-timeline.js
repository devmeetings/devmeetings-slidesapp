define(['angular', 'xplatform/xplatform-app', '_',
    'xplatform/services/dm-events/dm-events',
    'xplatform/directives/dm-timeline/dm-timeline'
], function(angular, xplatformApp, _) {
    xplatformApp.controller('dmXplatformTimeline', ['$scope', '$stateParams', 'dmEvents',
        function($scope, $stateParams, dmEvents) {

            dmEvents.getEventMaterial($stateParams.event, $stateParams.iteration, $stateParams.material).then(function(material) {
                $scope.audio = material.url;
                $scope.annotations = material.annotations;
            });

            $scope.state = dmEvents.getState($stateParams.event, $stateParams.material);

            $scope.$on('$destroy', function() {
                // next time we will be here, just continue
                $scope.state.startSecond = $scope.state.currentSecond;
            });


            var rates =
                [0.75, 1.0, 1.25, 1.5, 1.75, 2.0, 2.5, 3.0,
                    5.0, 10.0, 20.0, 40.0, 100.0
                ];
            $scope.state.playbackRate = rates[rates.length - 3];
            $scope.changeRate = function() {
                var nextRate = rates.indexOf($scope.state.playbackRate) + 1;
                nextRate = nextRate % rates.length;
                $scope.nextRate = rates[(nextRate + 1) % rates.length];
                $scope.state.playbackRate = rates[nextRate];
            };
            $scope.changeRate();

            $scope.keys.keyUp = function(event) {
                if (event.keyCode !== 32 || event.target.type === 'textarea') {
                    return;
                }
                $scope.state.isPlaying = !$scope.state.isPlaying;
            };

        }
    ]);
});
