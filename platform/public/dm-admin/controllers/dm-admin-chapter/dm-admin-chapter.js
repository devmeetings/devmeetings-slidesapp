define(['angular',
        'dm-admin/dm-admin-app',
        'services/Recordings',
        'services/RecordingsPlayerFactory',
        'directives/plugins-loader'
], function (angular, adminApp) {
    adminApp.controller('dmAdminChapter', ['$scope', '$stateParams', 'dmTrainings', '$http', 'RecordingsPlayerFactory',
        function ($scope, $stateParams, dmTrainings, $http, RecordingsPlayerFactory) {
            var setupChapter = function () {
                $scope.chapter = angular.copy($scope.training.chapters[$stateParams.index]);
                if ($scope.chapter.videodata === undefined) {
                    $scope.chapter.videodata = {};
                }
                if ($scope.chapter.taskdata === undefined) {
                    $scope.chapter.taskdata = {};
                }

                if ($scope.chapter.videodata.recordingTime === undefined) {
                    $scope.chapter.videodata.recordingTime = 0;
                }
            };

            dmTrainings.getTrainingWithId($stateParams.id).then(function (training) {
                $scope.training = training;
                setupChapter();
            });
            
            $scope.saveChapter = function () {
                $scope.training.chapters[$stateParams.index] = $scope.chapter;
                dmTrainings.putTraining($scope.training);
            };

            $scope.cancelSaveChapter = function () {
                setupChapter();
            };


            $scope.videopreview = {
                src: '',
                currentSecond: 0,
                startSecond: 0,
                isPlaying: 0
            };

            $scope.select = {
                recording: ''
            };

            $scope.recordingPlayer = {
                player: false,
                numberOfSlides: 0,
                length: 0
            };

        
            var goToSecond = function () {
                if (!$scope.recordingPlayer.player) {
                    return;
                }
                $scope.recordingPlayer.player.goToSecond($scope.videopreview.currentSecond + $scope.chapter.videodata.recordingTime);
            };
            

            $scope.$watch('chapter.videodata.url', function (newVal) {
                $scope.videopreview.src = newVal;
            });
            
            $scope.$watch('chapter.videodata.timestamp', function (newVal) {
                $scope.videopreview.startSecond= newVal;
                $scope.videopreview.currentSecond= newVal;
            });
            
            $scope.$watch('videopreview.currentSecond', function (newVal) {
                goToSecond();
            });

            $http.get('/api/recordings').success(function (recordings) {
                $scope.recordings = recordings;

                var rec = _.find(recordings, {_id: $scope.chapter.videodata.recording});
                $scope.select.recording = rec ? rec : '';
            });

            $scope.$watch('select.recording', function (newRecording) {
                if ($scope.recordingPlayer.player) {
                    $scope.recordingPlayer.player.pause();
                }

                $scope.chapter.videodata.recording = newRecording._id;
                $scope.recordingPlayer.player = RecordingsPlayerFactory($scope.select.recording, function (slide, wholeSlide) {
                    $scope.recordingPlayer.slide = slide;
                });
                $scope.recordingPlayer.numberOfSlides = $scope.select.recording.slides.length;
                $scope.recordingPlayer.length = $scope.recordingPlayer.player.length();
                
            });
            
    
            /*
            $scope.recordings = [{
                title: 'hej',
                group: 'grupa1'
            }, {
                title: 'hej1',
                group: 'title2'
            }];
            */
        }
    ]);
});
