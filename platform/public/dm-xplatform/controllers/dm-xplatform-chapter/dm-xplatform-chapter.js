define(['angular',
        'xplatform/xplatform-app',
        'directives/plugins-loader',
        'xplatform/controllers/dm-xplatform-chapter/dm-xplatform-chapter-save',
        'xplatform/controllers/dm-xplatform-chapter/dm-xplatform-chapter-next',
        'xplatform/controllers/dm-xplatform-chapter/dm-xplatform-chapter-open'
], function (angular, xplatformApp) {
    xplatformApp.controller('dmXplatformChapter', ['$scope', '$stateParams', '$http', '$modal', 'dmTrainings', 'RecordingsPlayerFactory',
        function ($scope, $stateParams, $http, $modal, dmTrainings, RecordingsPlayerFactory) {
            var trainingId = $stateParams.id;
            var chapterIndex = $stateParams.index;

            $scope.recordingPlayer = {
                //player
                //slide
            }

            dmTrainings.getTrainingWithId(trainingId).then (function (training) {
                $scope.chapter = training.chapters[chapterIndex];
                $scope.state.length = $scope.chapter.videodata.length;
                $http.get('/api/recordings/' + $scope.chapter.videodata.recording)
                .success(function (recording) {
                    $scope.recording = recording;  
                    
                    $scope.recordingPlayer.player = RecordingsPlayerFactory(recording, function (slide, wholeSlide) {
                        $scope.recordingPlayer.slide = slide;
                    });

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
            

            var modalIsOpened = false;
            $scope.$watch('state.currentSecond', function (newVal) {
                goToSecond();

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

            });
        }
    ]);
});
