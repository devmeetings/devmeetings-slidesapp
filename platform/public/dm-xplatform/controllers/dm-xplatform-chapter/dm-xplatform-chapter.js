define(['angular',
        'xplatform/xplatform-app',
        'directives/plugins-loader',
        'xplatform/controllers/dm-xplatform-chapter/dm-xplatform-chapter-save',
        'xplatform/controllers/dm-xplatform-chapter/dm-xplatform-chapter-next',
        'xplatform/controllers/dm-xplatform-chapter/dm-xplatform-chapter-open'
], function (angular, xplatformApp) {
    xplatformApp.controller('dmXplatformChapter', ['$scope', '$state', '$stateParams', '$timeout', '$http', '$modal', 'dmTrainings', 'RecordingsPlayerFactory', 'User',
        function ($scope, $state, $stateParams, $timeout, $http, $modal, dmTrainings, RecordingsPlayerFactory, User) {
            var trainingId = $stateParams.id;
            var chapterIndex = parseInt($stateParams.index);

            var goToSecond = function () {
                if (!$scope.recordingPlayer.player) {
                    return;
                }
                $scope.recordingPlayer.player.goToSecond(($scope.state.currentSecond - $scope.chapter.videodata.timestamp) + $scope.chapter.videodata.recordingTime);
            };
            

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
            
            };

            $scope.state.onRightButtonPressed = function () {
                $scope.state.startSecond = $scope.chapter.videodata.timestamp + $scope.state.length - 5; 
            };
            

            $scope.state.onSaveFile = function () {
                
                $scope.modalData.saveTitle = $scope.chapter.title;
                var modalInstance = $modal.open({
                    templateUrl: '/static/dm-xplatform/controllers/dm-xplatform-chapter/dm-xplatform-chapter-save.html',
                    controller: 'dmXplatformChapterSave',
                    size: 'sm',
                    resolve: {
                        modalData: function () {
                            return $scope.modalData;      
                       }
                    }
                });

                modalInstance.result.then(function (save) {
                    if (!save) {
                        return;
                    }

                    var fileToSave = {
                        title: $scope.modalData.saveTitle,
                        trainingId: trainingId,
                        userId: $scope.userId,
                        chapter: chapterIndex,
                        second: $scope.state.currentSecond,
                        slide: $scope.recordingPlayer.slide,
                        date: new Date()
                    };
                    
                    $http.post('/api/player', fileToSave);
                    $scope.files.push(fileToSave);
                });

            };

            User.getUserData(function (user) {
                $scope.userId = user._id;
                $http.get('/api/player/' + $scope.userId + '/' + trainingId).success(function (files) {
                    $scope.files = files;
                });
            });

            $scope.state.onOpenFile = function () {
                $scope.modalData.openTitle = undefined;

                var modalInstance = $modal.open({
                    templateUrl: '/static/dm-xplatform/controllers/dm-xplatform-chapter/dm-xplatform-chapter-open.html',
                    controller: 'dmXplatformChapterOpen',
                    size: 'sm',
                    resolve: {
                        files: function () {
                            return $scope.files;
                        },
                        modalData: function () {
                            return $scope.modalData;           
                        }
                    }
                });

                modalInstance.result.then(function (open) {
                    if (!open || $scope.modalData.openTitle === undefined) {
                        return;
                    }

                    var file = $scope.modalData.openTitle;
                    
                    $scope.state.isPlaying = false;
                    $scope.state.currentSecond = 0; //reset timer
                    
                    $timeout( function () {
                        $state.go('navbar.player.chapter', {index: file.chapter})
                        $timeout( function () {
                            $scope.recordingPlayer.slide = file.slide;
                            $scope.state.startSecond = file.second;
                        }, 1000);
                    }, 500);

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
