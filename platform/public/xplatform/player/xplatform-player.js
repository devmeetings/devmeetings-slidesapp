define(['angular', '_', 'video-js', 'video-js-youtube', 'xplatform/xplatform-app', 'services/Recordings', 'services/RecordingsPlayerFactory', 'slider/slider.plugins'],
        function (angular, _, videojs, videojsyoutube, xplatformApp, Recordings, RecordingsPlayerFactory, sliderPlugins) {
    angular.module('xplatform').controller('XplatformPlayerCtrl', ['$scope', 'Recordings', 'RecordingsPlayerFactory',
        function ($scope, Recordings, RecordingsPlayerFactory) {
            
            $scope.currentSecond = 0;
            $scope.maxSecond = 100;
            $scope.timeDelay = 0;
            
            var videojsPlayer = videojs('PLAYER_VIDEO', { 
                techOrder: ['youtube'], 
                src:'https://www.youtube.com/watch?v=cpBRAZ7RJvc'
            });
            videojsPlayer.on('timeupdate', function () {
                $scope.$apply( function (){
                    $scope.currentSecond = videojsPlayer.currentTime(); 
                });
            });
            
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
                $scope.player.goToSecond($scope.currentSecond + parseInt($scope.timeDelay));
                //$scope.play = true;
            };

            $scope.$watch('currentSecond', function (newVal, oldVal) {
                if (newVal === oldVal) {
                    return;
                }
                if (!$scope.player) {
                    return;
                }
                $scope.player.goToSecond(newVal + parseInt($scope.timeDelay)); 
            });
            
            $scope.$watch('timeDelay', function (newVal, oldVal) { 
                if (newVal === oldVal) {
                    return;
                }
                if (!$scope.player) {
                    return;
                }
                $scope.player.goToSecond($scope.currentSecond + parseInt(newVal)); 
            });

            /*
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
            */
        }
    ]);
});
