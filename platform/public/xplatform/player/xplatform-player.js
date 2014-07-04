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
                    template: '<div><video class="video-js vjs-default-skin" preload="auto" width="100%">' //
                    // TODO [ToDr] Chapters will be working in 4.7 version of video.js (not released yet)
                    //+ '<track kind="chapters" src="/static/xplatform/player/chapters.vtt" srclang="pl" label="Slajdy" default>' //
                    + '</video></div>',
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
        angular.module('xplatform').controller('XplatformPlayerCtrl', ['$scope', 'Recordings', 'RecordingsPlayerFactory', '$stateParams', '$timeout',
            function($scope, Recordings, RecordingsPlayerFactory, $stateParams, $timeout) {

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

                $scope.onRecordingSelected = function(index) {
                    if ($scope.player) {
                        $scope.player.pause();
                    }
                    var recording = $scope.recordings[index];
                    $scope.player = RecordingsPlayerFactory(recording, function(slide, wholeSlide) {
                        $scope.slide = slide;
                        $scope.wholeSlide = wholeSlide;
                    });
                    $scope.state.maxSecond = $scope.player.length();
                    $scope.goToSecond();
                    //$scope.play = true;
                };

                $scope.$watch('state.currentSecond', function(newVal, oldVal) {
                    if (newVal === oldVal) {
                        return;
                    }
                    $scope.goToSecond();
                    $scope.slideId = 'http://xplatform.org/decks/53aa9c9d5c03231c66ce3886#/' + $scope.findSlideData($scope.state.currentSecond).id;
                });

                $scope.$watch('state.timeDelay', function(newVal, oldVal) {
                    if (newVal === oldVal) {
                        return;
                    }
                    $scope.goToSecond();
                });

                $scope.findSlideData = function(timestamp) {
                    var data = $scope.timestampData.slice();
                    var last = null;
                    do {
                        last = data.shift();
                    } while (data[0] && data[0].timestamp < timestamp);

                    return last;
                };

                $scope.timestampData = [{
                    "timestamp": 0,
                    "end": 21,
                    "id": "53aa9dd35c03231c66ce3887",
                    "name": "Wprowadzenie,"
                }, {
                    "timestamp": 21,
                    "end": 945,
                    "id": "53aa9f415c03231c66ce3888",
                    "name": "Tablice i Literały"
                }, {
                    "timestamp": 945,
                    "end": 1822,
                    "id": "53aae93ecc503947710314b1",
                    "name": "Obiekty"
                }, {
                    "timestamp": 1822,
                    "end": 2669,
                    "id": "53aaf1d8cc503947710314b3",
                    "name": "Funkcje"
                }, {
                    "timestamp": 2669,
                    "end": 3214,
                    "id": "53aaf499cc503947710314b5",
                    "name": "Metody"
                }, {
                    "timestamp": 3214,
                    "end": 3455,
                    "id": "53aaf88a074cea9b7f2862ec",
                    "name": "HTML"
                }, {
                    "timestamp": 3455,
                    "end": 4161,
                    "id": "53aafcbc074cea9b7f2862ee",
                    "name": "HTML5"
                }, {
                    "timestamp": 4161,
                    "end": 4794,
                    "id": "53ab02b5074cea9b7f2862f0",
                    "name": "Modyfikowanie DOM"
                }, {
                    "timestamp": 4794,
                    "end": 5386,
                    "id": "53ab0576074cea9b7f2862f2",
                    "name": "Tworzenie elementów DOM"
                }, {
                    "timestamp": 5386,
                    "end": 6727,
                    "id": "53ab06b2074cea9b7f2862f4",
                    "name": "Zadanie - Lista Todos"
                }, {
                    "timestamp": 6727,
                    "end": 7090,
                    "id": "53ab06b2074cea9b7f2862f4",
                    "name": "Scopes"
                }, {
                    "timestamp": 7090,
                    "end": 7100,
                    "id": "538de6fb3b2fb14c48000010",
                    "name": "Zakończenie"
                }];
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
