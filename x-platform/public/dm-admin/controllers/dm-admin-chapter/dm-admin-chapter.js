define(['angular',
    'dm-admin/dm-admin-app',
    'services/Recordings',
    'services/RecordingsPlayerFactory',
    'directives/plugins-loader'
], function(angular, adminApp) {
    adminApp.controller('dmAdminChapter', ['$scope', '$stateParams', 'dmTrainings', '$http', 'RecordingsPlayerFactory',
        function($scope, $stateParams, dmTrainings, $http, RecordingsPlayerFactory) {
            var setupRecordings = function() {
                if ($scope.chapter && $scope.chapter.videodata.recording && $scope.recordings) {
                    var rec = _.find($scope.recordings, {
                        _id: $scope.chapter.videodata.recording
                    });
                    $scope.select.recording = rec ? rec : '';
                }
            };

            var setupChapter = function() {
                $scope.chapter = angular.copy($scope.training.chapters[$stateParams.index]);
                $scope.chapter.videodata = $scope.chapter.videodata || {}
                $scope.chapter.taskdata = $scope.chapter.taskdata || {};
                $scope.chapter.videodata.recordingTime = $scope.chapter.videodata.recordingTime || 0;
                setupRecordings();
            };

            dmTrainings.getTrainingWithId($stateParams.id).then(function(training) {
                $scope.training = training;
                setupChapter();
            });

            $scope.saveChapter = function() {
                $scope.training.chapters[$stateParams.index] = $scope.chapter;
                dmTrainings.putTraining($scope.training);
            };

            $scope.cancelSaveChapter = function() {
                setupChapter();
            };


            $scope.videopreview = {
                src: '',
                currentSecond: 0,
                startSecond: 0,
                isPlaying: 0
            };

            $scope.select = {
                recording: undefined
            };

            $scope.recordingPlayer = {
                player: false,
                numberOfSlides: 0,
                length: 0
            };


            var goToSecond = function() {
                if (!$scope.recordingPlayer.player) {
                    return;
                }
                $scope.recordingPlayer.player.goToSecond(($scope.videopreview.currentSecond - $scope.videopreview.startSecond) + $scope.chapter.videodata.recordingTime);
            };


            $scope.$watch('chapter.videodata.url', function(newVal) {
                $scope.videopreview.src = newVal;
            });

            $scope.$watch('chapter.videodata.timestamp', function(newVal) {
                $scope.videopreview.startSecond = newVal;
                $scope.videopreview.currentSecond = newVal;
            });

            $scope.$watch('videopreview.currentSecond', function(newVal) {
                goToSecond();
            });

            $scope.$watch('chapter.videodata.recordingTime', function(newVal) {
                goToSecond();
            });

            $http.get('/editor/soundslist').success(function(sounds) {
                $scope.sounds = sounds;
            });

            function refreshRecordings() {
                $http.get('/api/recordings').success(function(recordings) {
                    $scope.recordings = recordings;
                    setupRecordings();
                });
            }
            refreshRecordings();

            $scope.split = function(recording, time) {
                $http.post('/api/recordings/' + recording._id + '/split/' + time).success(function() {
                    alert('Cutted - reload');
                    refreshRecordings();
                });
            };
            $scope.cut = {};
            $scope.cutout = function(recording, from, to) {
                $http.post('/api/recordings/' + recording._id + '/cutout/' + from + '/' + to).success(function() {
                    alert('Cutted out - reload');
                    refreshRecordings();
                });
            };

            $scope.$watch('select.recording', function(newRecording) {
                if (newRecording === undefined) {
                    return;
                }

                if ($scope.recordingPlayer.player) {
                    $scope.recordingPlayer.player.pause();
                }

                $scope.chapter.videodata.recording = newRecording._id;
                $scope.chapter.videodata.timestamp = $scope.chapter.videodata.timestamp || 0;

                // Download specific recording
                $http.get('/api/recordings/' + newRecording._id).success(function(rec) {
                    $scope.recordingPlayer.player = RecordingsPlayerFactory(rec, function(slide, wholeSlide) {
                        $scope.recordingPlayer.slide = slide;
                    });
                    $scope.recordingPlayer.numberOfSlides = rec.slides.length;
                    $scope.recordingPlayer.length = $scope.recordingPlayer.player.length();
                });
            });
        }
    ]);
});