define(['angular', '_', 'video-js', 'video-js-youtube', 'xplatform/xplatform-app', 'services/Recordings', 'services/RecordingsPlayerFactory', 'slider/slider.plugins'],
    function(angular, _, videojs, videojsyoutube, xplatformApp, Recordings, RecordingsPlayerFactory, sliderPlugins) {

        angular.module('xplatform').directive('videojs', [

            function() {

                return {
                    restrict: 'E',
                    scope: {
                        src: '=',
                        currentSecond: '='
                    },
                    template: '<div><video class="video-js vjs-default-skin" controls preload="auto" width="512" height="211"></video></div>',
                    link: function(scope, element) {
                        var player = videojs(element.find('video')[0], {
                            techOrder: ['youtube'],
                            src: scope.src
                        });
                        player.on('timeupdate', function() {
                            scope.$apply(function() {
                                scope.currentSecond = player.currentTime();
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