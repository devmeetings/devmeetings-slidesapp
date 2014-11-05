define(['angular', 'xplatform/xplatform-app', '_',
    'xplatform/services/dm-events/dm-events',
    'xplatform/services/dm-recordings/dm-recordings',
    'services/RecordingsPlayerFactory'
], function(angular, xplatformApp, _) {
    xplatformApp.controller('dmXplatformPlayer', ['$scope', '$stateParams', 'dmEvents', 'dmRecordings', 'RecordingsPlayerFactory',
        function($scope, $stateParams, dmEvents, dmRecordings, RecordingsPlayerFactory) {

            dmEvents.getEvent($stateParams.event, false).then(function(data) {
                var material = _.find(data.iterations[$stateParams.iteration].materials, function(elem) {
                    return elem._id === $stateParams.material;
                });
                return dmRecordings.getRecording(material.material);
            }).then(function(recording) {
                $scope.recordingPlayer = RecordingsPlayerFactory(recording, function(slide) {
                    $scope.slide = slide;
                });
                goToSecond();
            });


            $scope.nextStop = 0;

            var goToSecond = _.throttle(function(curr, prev) {
                if (!$scope.recordingPlayer) {
                    return;
                }
                var second = $scope.state.currentSecond;

                $scope.recordingPlayer.goToSecond(second);

                if (second > $scope.nextStop) {
                    $scope.state.isPlaying = false;

                    var anno = _.find($scope.annotations, function(anno) {
                        return anno.timestamp > $scope.nextStop
                    });
                    if (anno) {
                        $scope.nextStop = anno.timestamp;
                    }
                }
            }, 3);

            $scope.state = dmEvents.getState($stateParams.event, $stateParams.material);

            $scope.$watch('state.currentSecond', goToSecond);

            dmEvents.getEventMaterial($stateParams.event, $stateParams.iteration, $stateParams.material).then(function(material) {
                $scope.annotations = material.annotations;
            });

        }
    ]);
});