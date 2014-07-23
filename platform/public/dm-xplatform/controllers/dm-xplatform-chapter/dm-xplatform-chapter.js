define(['angular',
        'xplatform/xplatform-app',
        'directives/plugins-loader'
], function (angular, xplatformApp) {
    xplatformApp.controller('dmXplatformChapter', ['$scope', '$stateParams', '$http', 'dmTrainings', 'RecordingsPlayerFactory',
        function ($scope, $stateParams, $http, dmTrainings, RecordingsPlayerFactory) {
            var trainingId = $stateParams.id;
            var chapterIndex = $stateParams.index;

            $scope.recordingPlayer = {
                //player
                //slide
            }

            dmTrainings.getTrainingWithId(trainingId).then (function (training) {
                $scope.chapter = training.chapters[chapterIndex];
                $http.get('/api/recordings/' + $scope.chapter.videodata.recording)
                .success(function (recording) {
                    $scope.recording = recording;  
                    
                    $scope.recordingPlayer.player = RecordingsPlayerFactory(recording, function (slide, wholeSlide) {
                        $scope.recordingPlayer.slide = slide;
                    });

                    $scope.state.length = $scope.recordingPlayer.player.length();

                });
            });

            var goToSecond = function () {
                if (!$scope.recordingPlayer.player) {
                    return;
                }
                $scope.recordingPlayer.player.goToSecond(($scope.state.currentSecond - $scope.chapter.videodata.timestamp) + $scope.chapter.videodata.recordingTime);
            };
            
            // implement state interface
            
            $scope.state.onLeftButtonPressed = function () {
            
            };

            $scope.state.onRightButtonPressed = function () {
           
            };

            $scope.$watch('state.currentSecond', function (newVal) {
                goToSecond(); 
            });
        }
    ]);
});
