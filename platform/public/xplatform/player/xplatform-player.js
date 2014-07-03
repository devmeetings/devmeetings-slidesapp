define(['angular', '_', 'video-js', 'video-js-youtube', 'xplatform/xplatform-app', 'services/Recordings', 'services/RecordingsPlayerFactory', 'slider/slider.plugins'],
    function(angular, _, videojs, videojsyoutube, xplatformApp, Recordings, RecordingsPlayerFactory, sliderPlugins) {

        angular.module('xplatform').directive('videojs', [
            '$timeout',
            function($timeout) {

                return {
                    restrict: 'E',
                    scope: {
                        src: '=',
                        currentSecond: '=',
                        isPlaying: '=',
                        delay: '=',
                        shouldUpdateTime: '@',
                        controls: '@',
                        height: '@'
                    },
                    template: '<div><video class="video-js vjs-default-skin" preload="auto" width="100%"></video></div>',
                    link: function(scope, element) {

                        var $video = element.find('video')[0];
                        if (scope.controls) {
                            $video.setAttribute('controls', true);
                        }
                        $video.setAttribute('height', scope.height);

                        var player = videojs($video, {
                            techOrder: ['youtube'],
                            src: scope.src
                        }, function() {
                            $timeout(function() {
                                updateCurrentTime();
                            });
                        });

                        var updateCurrentTime = function() {
                            var delay = parseInt(scope.delay, 10) || 0;
                            player.currentTime(Math.round(scope.currentSecond + delay));
                        };

                        if (scope.shouldUpdateTime) {
                            player.on('timeupdate', function() {
                                scope.$apply(function() {
                                    var time = player.currentTime();
                                    // Don't override when there is 0 in currentTime and we already played video
                                    if (time) {
                                        scope.currentSecond = time;
                                    }
                                });
                            });
                        }

                        player.on('play', function() {
                            scope.$apply(function() {
                                scope.isPlaying = true;
                            });
                        });

                        player.on('pause', function() {
                            scope.$apply(function() {
                                scope.isPlaying = false;
                                if (scope.shouldUpdateTime) {
                                    scope.currentSecond = Math.round(scope.currentSecond);
                                }
                            });
                        });

                        scope.$watch('delay', function() {
                            updateCurrentTime();
                        });

                        scope.$watch('isPlaying', function(newVal, oldVal) {
                            if (newVal === oldVal) {
                                return;
                            }

                            $timeout(function() {
                                if (scope.isPlaying) {
                                    if (player.paused()) {
                                        player.play();
                                    }
                                } else {
                                    if (!player.paused()) {
                                        player.pause();
                                    }
                                }
                                updateCurrentTime();
                            });
                        });

                        scope.$on('$destroy', function() {
                            player.dispose();
                        });
                    }
                }
            }
        ]);
        angular.module('xplatform').controller('XplatformPlayerCtrl', ['$scope', 'Recordings', 'RecordingsPlayerFactory', '$stateParams',
            function($scope, Recordings, RecordingsPlayerFactory, $stateParams) {

                $scope.layout = $stateParams.layout;
                $scope.state = {
                    currentSecond: 0,
                    maxSecond: 100,
                    timeDelay: 782,
                    secondVideoDelay: -28.5,
                    isPlaying: false
                };

                Recordings.getRecordings().success(function(recordings) {
                    $scope.recordings = recordings;
                    // TODO [ToDr] Selecting single recording for now.
                    $scope.onRecordingSelected(2);
                    // TODO:End
                });

                var goToSecond = function() {
                    if (!$scope.player) {
                        return;
                    }
                    $scope.player.goToSecond($scope.state.currentSecond + parseInt($scope.state.timeDelay));
                };

                $scope.onRecordingSelected = function(index) {
                    if ($scope.player) {
                        $scope.player.pause();
                    }
                    var recording = $scope.recordings[index];
                    $scope.player = RecordingsPlayerFactory(recording, function(slide) {
                        $scope.slide = slide;
                    });
                    $scope.state.maxSecond = $scope.player.length();
                    goToSecond();
                    //$scope.play = true;
                };

                $scope.$watch('state.currentSecond', function(newVal, oldVal) {
                    if (newVal === oldVal) {
                        return;
                    }
                    goToSecond();
                });

                $scope.$watch('state.timeDelay', function(newVal, oldVal) {
                    if (newVal === oldVal) {
                        return;
                    }
                    goToSecond();
                });
            }
        ]);
    });