define(['angular', 'xplatform/xplatform-app',
        'xplatform/services/dm-events/dm-events',
        'xplatform/services/dm-recordings/dm-recordings',
        'services/RecordingsPlayerFactory'], function (angular, xplatformApp) {   
    xplatformApp.controller('dmXplatformPlayer', ['$scope', '$stateParams', 'dmEvents', 'dmRecordings', 'RecordingsPlayerFactory', function ($scope, $stateParams, dmEvents, dmRecordings, RecordingsPlayerFactory) {
            
        dmEvents.getEvent($stateParams.event, false).then(function (data) {
            var audio = data.audios[$stateParams.index];
            return dmRecordings.getRecording(audio.recording);
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

        $scope.state = dmEvents.getState($stateParams.event, $stateParams.index);

        $scope.$watch('state.currentSecond', goToSecond);

    }]);
});

