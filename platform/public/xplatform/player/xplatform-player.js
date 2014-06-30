define(['angular', '_', 'xplatform/xplatform-app', 'services/Recordings', 'services/RecordingsPlayerFactory', 'slider/slider.plugins'],
        function (angular, _, xplatformApp, Recordings, RecordingsPlayerFactory, sliderPlugins) {
    angular.module('xplatform').controller('XplatformPlayerCtrl', ['$scope', 'Recordings', 'RecordingsPlayerFactory',
        function ($scope, Recordings, RecordingsPlayerFactory) {
       
            $scope.currentSecond = 0;
            $scope.maxSecond = 100;

            Recordings.getRecordings().success( function (recordings) {
                $scope.recordings = recordings;
            });

            $scope.onRecordingSelected = function (index) {
                if ($scope.player) {
                    $scope.player.pause();
                }
                var recording = $scope.recordings[index];
                $scope.player = RecordingsPlayerFactory(recording, function (slide) {
                    $scope.slide = slide;
                });
                $scope.maxSecond = $scope.player.length(); 
                $scope.play = true;
            };

            $scope.$watch('play', function (newVal, oldVal) {
                if (newVal === oldVal) {
                    return;
                }
                if (!$scope.player) {
                    return;
                }
                if (newVal) {
                    $scope.player.play();
                    return;
                }
                $scope.player.pause();
            });

            $scope.$watch('currentSecond', function (newVal, oldVal) {
                if (newVal === oldVal) {
                    return;
                }
                if (!$scope.player) {
                    return;
                }
                $scope.player.goToMinisecond(newVal); 
            });
        }
    ]);
});
