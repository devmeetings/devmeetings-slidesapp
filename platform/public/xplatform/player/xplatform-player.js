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
                        shouldUpdateTime: '@',
                        controls: '@'
                    },
                    template: '<div><video class="video-js vjs-default-skin" preload="auto" width="512" height="211"></video></div>',
                    link: function(scope, element) {

                        var $video = element.find('video')[0];
                        if (scope.controls) {
                            $video.setAttribute('controls', true);
                        }
                        var player = videojs($video, {
                            techOrder: ['youtube'],
                            src: scope.src
                        });
                        if (scope.shouldUpdateTime) {
                            player.on('timeupdate', function() {
                                scope.$apply(function() {
                                    scope.currentSecond = player.currentTime();
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
                            });
                        });

                        scope.$watch('isPlaying', function(newVal, oldVal) {
                            if (newVal === oldVal) {
                                return;
                            }

                            $timeout(function() {
                                if (scope.isPlaying) {
                                    if (!player.paused()) {
                                        player.play();
                                    }
                                    player.currentTime(Math.round(scope.currentSecond));
                                } else {
                                    if (player.paused()) {
                                        return;
                                    }
                                    player.pause();
                                }
                            });
                        });
                    }
                }
            }
        ]);
        angular.module('xplatform').controller('XplatformPlayerCtrl', ['$scope', 'Recordings', 'RecordingsPlayerFactory',
            function($scope, Recordings, RecordingsPlayerFactory) {

                $scope.layout = 'first';
                $scope.state = {
                    currentSecond: 0,
                    maxSecond: 100,
                    timeDelay: 0
                };

                Recordings.getRecordings().success(function(recordings) {
                    $scope.recordings = recordings;
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