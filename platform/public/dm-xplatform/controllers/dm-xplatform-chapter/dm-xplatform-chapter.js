define(['angular',
        'xplatform/xplatform-app',
        'directives/plugins-loader',
        'xplatform/controllers/dm-xplatform-chapter/dm-xplatform-chapter-save',
        'xplatform/controllers/dm-xplatform-chapter/dm-xplatform-chapter-next',
        'xplatform/controllers/dm-xplatform-chapter/dm-xplatform-chapter-open'
], function (angular, xplatformApp) {
    xplatformApp.controller('dmXplatformChapter', ['$scope', '$state', '$stateParams', '$timeout', '$http', '$modal', 'dmTrainings', 'RecordingsPlayerFactory',
        function ($scope, $state, $stateParams, $timeout, $http, $modal, dmTrainings, RecordingsPlayerFactory) {
            var trainingId = $stateParams.id;
            var chapterIndex = parseInt($stateParams.index);

            var goToSecond = function () {
                if (!$scope.recordingPlayer.player) {
                    return;
                }
                $scope.recordingPlayer.player.goToSecond(($scope.state.currentSecond - $scope.chapter.videodata.timestamp) + $scope.chapter.videodata.recordingTime);
            };
            
            $scope.recordingPlayer = {
                //player
                //slide
            }

            dmTrainings.getTrainingWithId(trainingId).then (function (training) {
                $scope.chapter = training.chapters[chapterIndex];
                $scope.state.startSecond = $scope.chapter.videodata.timestamp;
                $scope.state.chapterId = chapterIndex;
                $scope.state.length = $scope.chapter.videodata.length;
                $http.get('/api/recordings/' + $scope.chapter.videodata.recording)
                .success(function (recording) {
                    $scope.recording = recording;  
                    
                    $scope.recordingPlayer.player = RecordingsPlayerFactory(recording, function (slide, wholeSlide) {
                        $scope.recordingPlayer.slide = slide;
                    });
                    goToSecond();
                });
            });

            // implement state interface
            
            $scope.state.onLeftButtonPressed = function () {
            
            };

            $scope.state.onRightButtonPressed = function () {
                var previousState = $scope.state.isPlaying;
                //$scope.state.isPlaying = false;
                //$timeout(function () {
                    $scope.state.startSecond = $scope.chapter.videodata.timestamp + $scope.state.length - 5; 
                //    $scope.state.isPlaying = previousState; 
                //}, 500);
            };

            $scope.state.onSaveFile = function () {
                    var modalInstance = $modal.open({
                        templateUrl: '/static/dm-xplatform/controllers/dm-xplatform-chapter/dm-xplatform-chapter-save.html',
                        controller: 'dmXplatformChapterSave',
                        size: 'sm',
                        resolve: {
                            title: function () {
                                return angular.copy($scope.chapter.title);      
                            }
                        }
                    });
            };

            $scope.state.onOpenFile = function () {
                    var modalInstance = $modal.open({
                        templateUrl: '/static/dm-xplatform/controllers/dm-xplatform-chapter/dm-xplatform-chapter-open.html',
                        controller: 'dmXplatformChapterOpen',
                        size: 'sm',
                        resolve: {
                            files: function () {
                                return [{
                                    title: '1'
                                }, {
                                    title: '2'
                                }, { 
                                    title: '3'
                                }]; 
                            }
                        }
                    });
            };

            

            var modalIsOpened = false;
            
            $scope.$watch('state.currentSecond', function (newVal) {
                if ($scope.state.chapterId !== chapterIndex) {
                    return;
                }
                
                goToSecond();
                
                if (!$scope.chapter || !$scope.chapter.videodata) {
                    return;
                }
                
                if (!$scope.state.isPlaying) {
                    return;
                }

                var remaining = $scope.state.length - ($scope.state.currentSecond - $scope.chapter.videodata.timestamp);
                if (remaining > 0) {
                    return;
                }

                if (modalIsOpened) {
                    return;
                }

                modalIsOpened = true;

                $scope.state.isPlaying = false;

                var modalInstance = $modal.open({
                    templateUrl: '/static/dm-xplatform/controllers/dm-xplatform-chapter/dm-xplatform-chapter-next.html',
                    controller: 'dmXplatformChapterNext',
                    size: 'sm',
                    resolve: {
                        title: function () {
                           return angular.copy($scope.chapter.title);    
                        }
                    }
                });

                modalInstance.result.then( function (next) {
                    modalIsOpened = false;
                    if (!next) {
                        return;
                    }

                    $scope.state.isPlaying = false;
                    $scope.state.currentSecond = 0; //reset timer

                    $timeout(function () {
                        $state.go('navbar.player.chapter', {
                            index: parseInt(chapterIndex) + 1
                        });
                    }, 500);
                });

            });
        }
    ]);
});
