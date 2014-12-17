define(['angular', 'xplatform/xplatform-app', '_',
    'xplatform/services/dm-events/dm-events',
    'xplatform/directives/dm-timeline/dm-timeline'
], function(angular, xplatformApp, _) {
    xplatformApp.controller('dmXplatformTimeline', ['$scope', '$stateParams', 'dmEvents', '$window',
        function($scope, $stateParams, dmEvents, $window) {

            function fetchAnnotations() {
              dmEvents.getEventMaterial($stateParams.event, $stateParams.iteration, $stateParams.material).then(function(material) {
                  $scope.audio = material.url;
                  $scope.annotations = material.annotations;
              });
            }
            fetchAnnotations();
            $scope.$on('newAnnotations', fetchAnnotations);

            $scope.state = dmEvents.getState($stateParams.event, $stateParams.material);

            $scope.$on('$destroy', function() {
                // next time we will be here, just continue
                $scope.state.startSecond = $scope.state.currentSecond;
            });


            $scope.setTime = function(time) {
              $scope.setSecond = time;
            };
            $window.setTime = function(time) {
              $scope.$apply(function(){
                $scope.setSecond = time;
              });
            };


            var rates =
                [0.75, 1.0, 1.25, 1.5, 1.75, 2.0, 2.5, 3.0, 3.5, 4.0, 4.5,
                    5.0, 10.0
                ];
            $scope.state.playbackRate = rates[rates.length - 7];
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
