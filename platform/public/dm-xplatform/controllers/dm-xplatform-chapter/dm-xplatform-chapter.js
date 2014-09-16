define(['angular',
        'xplatform/xplatform-app',
        'directives/plugins-loader',
        'xplatform/controllers/dm-xplatform-chapter/dm-xplatform-chapter-next',
        'services/RecordingsPlayerFactory'
], function (angular, xplatformApp) {
    xplatformApp.controller('dmXplatformChapter', ['$scope', '$state', '$stateParams', '$timeout', '$http', '$modal', 'dmTrainings', 'RecordingsPlayerFactory', 'User',
        function ($scope, $state, $stateParams, $timeout, $http, $modal, dmTrainings, RecordingsPlayerFactory, User) {
            var trainingId = $stateParams.id;
            var chapterIndex = parseInt($stateParams.index);

            var goToSecond = function () {
                $scope.state.activeChapterPercentage = ($scope.state.currentSecond - $scope.chapter.videodata.timestamp) / $scope.state.length * 100;
                if (!$scope.recordingPlayer.player) {
                    return;
                }
                $scope.recordingPlayer.player.goToSecond(($scope.state.currentSecond - $scope.chapter.videodata.timestamp) + $scope.chapter.videodata.recordingTime);
            };

            
            $http.post('/api/event/start/' + $stateParams.event);
            $http.get('/api/event/first_task/' + $stateParams.event).success(function (slideId) {
                $scope.nextSlideId = slideId;
            });

            $scope.modalData = {
               //saveTitle
               //openTitle
            };

            dmTrainings.getTrainingWithId(trainingId).then (function (training) {
                $scope.chapter = training.chapters[chapterIndex];
                $scope.state.startSecond = $scope.chapter.videodata.timestamp;
                $scope.state.chapterId = chapterIndex;
                $scope.state.length = $scope.chapter.videodata.length;
                $http.get('/api/recordings/' + $scope.chapter.videodata.recording)
                .success(function (recording) {
                    $scope.recording = recording;  
                   
                    if ($scope.recordingPlayer.player) {
                        $scope.recordingPlayer.player.pause();
                    }
                    $scope.recordingPlayer.player = RecordingsPlayerFactory(recording, function (slide, wholeSlide) {
                        $scope.recordingPlayer.slide = slide;
                    });
                    goToSecond();
                });
            });

            // implement state interface
            
            $scope.state.onLeftButtonPressed = function () {
                var sec = Math.max($scope.state.currentSecond - 15, $scope.chapter.videodata.timestamp);
                if ($scope.state.startSecond === sec) {
                    $scope.state.startSecond = sec + 1;
                } else {
                    $scope.state.startSecond = sec;
                }
            };

            $scope.state.onRightButtonPressed = function () {
                $scope.state.startSecond = $scope.state.currentSecond + 15;
                //$scope.state.startSecond = $scope.chapter.videodata.timestamp  + $scope.state.length - 5;
            };

            User.getUserData(function (user) {
                $scope.userId = user._id;
            });

            $scope.onEnd = function () {
                var modalInstance = $modal.open({
                    templateUrl: '/static/dm-xplatform/controllers/dm-xplatform-chapter/dm-xplatform-chapter-next.html',
                    controller: 'dmXplatformChapterNext',
                    size: 'sm',
                    windowClass: 'course-modal',
                    resolve: {
                        title: function () {
                            return angular.copy($scope.chapter.title);    
                        },
                        slideId: function () {
                            return $scope.nextSlideId; 
                        },
                        eventId: function () {
                            return $stateParams.event;         
                        }
                    }
                });

                modalInstance.result.then( function (next) {
                    modalIsOpened = false; 
                    $http.post('/api/event/done/' + $stateParams.event);
                    if (!next) {
                        return;
                    }

                    $scope.state.isPlaying = false;
                    $scope.state.currentSecond = 0; //reset timer

                    $state.go('index.menu', {
                        type: 'video'
                    });
                });
            };

            $scope.state.playbackRate = 0.5;
            var rates = [0.75, 1.0, 1.25, 1.5, 1.75, 2.0];
            $scope.changeRate = function() {
                var nextRate = rates.indexOf($scope.state.playbackRate) + 1;
                nextRate = nextRate % rates.length;
                $scope.nextRate = rates[(nextRate + 1) % rates.length];
                $scope.state.playbackRate = rates[nextRate];
            };
            $scope.changeRate();

        }
    ]);
});
