define(['angular', 'xplatform/xplatform-app', '_',
        'xplatform/services/dm-events/dm-events',
        'xplatform/services/dm-recordings/dm-recordings',
        'services/RecordingsPlayerFactory'], function (angular, xplatformApp, _) {   
    xplatformApp.controller('dmXplatformPlayer', ['$scope', '$stateParams', 'dmEvents', 'dmRecordings', 'RecordingsPlayerFactory', function ($scope, $stateParams, dmEvents, dmRecordings, RecordingsPlayerFactory) {
            
        dmEvents.getEvent($stateParams.event, false).then(function (data) {
            var material = _.find(data.iterations[$stateParams.iteration].materials, function (elem) {
                return elem._id === $stateParams.material;
            });
            return dmRecordings.getRecording(material.material);
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

        $scope.state = dmEvents.getState($stateParams.event, $stateParams.material);

        $scope.$watch('state.currentSecond', goToSecond);

    }]);
});

