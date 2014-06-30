define(['angular', '_', 'xplatform/xplatform-app', 'services/Recordings', 'services/RecordingsPlayerFactory', 'slider/slider.plugins'],
        function (angular, _, xplatformApp, Recordings, RecordingsPlayerFactory, sliderPlugins) {
    angular.module('xplatform').controller('XplatformPlayerCtrl', ['$scope', 'Recordings', 'RecordingsPlayerFactory',
        function ($scope, Recordings, RecordingsPlayerFactory) {
        
            Recordings.getRecordings().success( function (recordings) {
                $scope.recordings = recordings;
            });

            $scope.onRecordingSelected = function (index) {
                var recording = $scope.recordings[index];
                $scope.player = RecordingsPlayerFactory(recording, function (slide) {
                    $scope.slide = slide;
                });
                $scope.player.play();
            };
        }
    ]);
});
