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
                        controls: '@',
                        height: '@'
                    },
                    template: '<div><video class="video-js vjs-default-skin" preload="auto" width="100%" autoplay="autoplay">' //
                    // TODO [ToDr] Chapters will be working in 4.7 version of video.js (not released yet)
                    //+ '<track kind="chapters" src="/static/xplatform/player/chapters.vtt" srclang="pl" label="Slajdy" default>' //
                    + '</video></div>',
                    link: function(scope, element) {

                        var $video = element.find('video')[0];
                        if (scope.controls) {
                            $video.setAttribute('controls', true);
                        }
                        $video.setAttribute('height', scope.height);
                        
                        var initialized = false;
                        scope.$watch('src', function(newSrc) {
                            if (initialized || newSrc === "") {
                                return;
                            }

                            var player = videojs($video, {
                                techOrder: ['youtube', 'html5'],
                                src: scope.src 
                            }, function() {
                                $timeout(function() {
                                    updateCurrentTime();
                                });
                            }).ready(function () {
                                player = this;
                            });
                            initialize = true;
                        
                            player.on('timeupdate', function () {
                                scope.$apply(function () {
                                    var time = player.currentTime();
                                    if (time) {
                                        scope.currentSecond = time;
                                    }
                                });
                            });

                            player.on('play', function () {
                                scope.$apply( function () {
                                    scope.isPlaying = true;
                                });
                            });

                            player.on('pause', function () {
                                scope.$apply( function () {
                                    scope.isPlaying = false;
                                    scope.currentSecond = Math.round(scope.currentSecond);
                                });
                            });

                            var updateCurrentTime = function() {
                                var delay = parseInt(scope.delay, 10) || 0;
                                var time = Math.round(scope.currentSecond + delay)
                                player.currentTime(time);
                                scope.$apply(function () {
                                    currentSecond = time;
                                });
                            };

                            scope.$watch('isPlaying', function (newVal, oldVal) {
                                if (newVal === oldVal) {
                                    return;
                                }

                                $timeout(function() {
                                    if (scope.isPlaying) {
                                        if (player.paused()){
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
                        });

                    }
                }
            }
        ]);
        angular.module('xplatform').controller('XplatformPlayerCtrl', ['$scope', 'Recordings', 'RecordingsPlayerFactory', '$stateParams', '$timeout',
            function($scope, Recordings, RecordingsPlayerFactory, $stateParams, $timeout) {

                $scope.state = {
                    currentSecond: 0,
                    maxSecond: 100,
                    timeDelay: 0,
                    videoUrl: '',
                    isPlaying: false
                };

                Recordings.getRecordingWithId($stateParams.id).success( function (recording) {
                    if ($scope.player) {
                        $scope.player.pause();
                    }

                    $scope.chapters = recording.chapters;
                    $scope.state.videoUrl = recording.videoUrl;
                    $scope.state.timeDelay = recording.timeOffset;
                    $scope.player = RecordingsPlayerFactory(recording, function(slide, wholeSlide) {
                        $scope.slide = slide;
                        $scope.wholeSlide = wholeSlide;
                    });
                    $scope.state.maxSecond = $scope.player.length();
                    $scope.goToSecond();
                });
                
                $scope.secondIsActive = function (slide, second) {
                    return slide.timestamp < second && slide.end > second;
                };

                $scope.goToSecond = function() {
                    if (!$scope.player) {
                        return;
                    }
                    $scope.player.goToSecond($scope.state.currentSecond + parseInt($scope.state.timeDelay));
                };
                $scope.jumpTo = function(second) {
                    $scope.state.isPlaying = false;
                    $timeout(function() {
                        $scope.state.currentSecond = second;
                        $scope.state.isPlaying = true;
                    }, 500);
                };

                $scope.$watch('state.currentSecond', function(newVal, oldVal) {
                    if (newVal === oldVal) {
                        return;
                    }
                    $scope.goToSecond();
                });
            }
        ]);

        angular.module('xplatform').config(['$sceDelegateProvider',
            function($sceDelegateProvider) {
                $sceDelegateProvider.resourceUrlWhitelist([
                    'self',
                    'http://devmeetings.pl/**',
                    'http://*.xplatform.org/**',
                    'http://xplatform.org/**'
                ]);
            }
        ]);
    });
