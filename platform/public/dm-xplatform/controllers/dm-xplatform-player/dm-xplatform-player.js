define(['angular', 'xplatform/xplatform-app',
        'xplatform/services/dm-events/dm-events',
        'xplatform/services/dm-recordings/dm-recordings'], function (angular, xplatformApp) {   
    xplatformApp.controller('dmXplatformPlayer', ['$scope', '$stateParams', 'dmEvents', 'dmRecordings', 'RecordingsPlayerFactory', function ($scope, $stateParams, dmEvents, dmRecordings, RecordingsPlayerFactory) {
            
        dmEvents.getEvent($stateParams.event, false).then(function (data) {
            $scope.audio = data.audio;
            return dmRecordings.getRecording(data.recording);
        }).then(function (recording) {
            $scope.recordingPlayer = RecordingsPlayerFactory(recording, function (slide) {
                $scope.slide = slide;
            });
            goToSecond();
        });
       
        var goToSecond = function () {
            if (!$scope.recordingPlayer) {
                return;
            }
            $scope.recordingPlayer.goToSecond($scope.state.currentSecond);
        };

        $scope.state = dmEvents.getState();

        $scope.$watch('state.currentSecond', goToSecond);

    }]);
});

