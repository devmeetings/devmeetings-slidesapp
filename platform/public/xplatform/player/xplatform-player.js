define(['module',
        'angular',
        '_',
        'video-js',
        'video-js-youtube',
        'angular-slider',
        'angular-moment',
        'angular-hotkeys',
        'angular-bootstrap',
        'xplatform/xplatform-app',
        'services/Recordings', 
        'services/RecordingsPlayerFactory', 
        'services/User', 
        'slider/slider.plugins',
        'utils/ExtractPath'],
    function(
        module,
        angular,
        _, 
        videojs, 
        videojsyoutube, 
        angularSlider, 
        angularMoment, 
        angularHotkeys, 
        angularBootstrap,
        xplatformApp, 
        Recordings, 
        RecordingsPlayerFactory, 
        User, 
        sliderPlugins,
        ExtractPath) {

        var path = ExtractPath(module);

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
                        videoLength: '=',
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
                            $video.setAttribute('controls', false);
                        }
                        $video.setAttribute('height', scope.height);
                        
                        var initialized = false;
                        scope.$watch('src', function(newSrc) {
                            if (initialized || newSrc === "") {
                                return;
                            }

                            var player = videojs($video, {
                                techOrder: ['youtube', 'html5'],
                                quality: '720p',
                                src: scope.src 
                            }, function() {
                                $timeout(function() {
                                    updateCurrentTime();
                                });
                            }).ready(function () {
                                player = this;
                                scope.$apply(function() {
                                    scope.videoLength = player.duration();
                                });
                            });
                            initialize = true;
                        
                            player.on('timeupdate', function () {
                                scope.$apply(function () {
                                    var time = player.currentTime();
                                    if (time && scope.isPlaying) {
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
                                    scope.currentSecond = time;
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
        angular.module('xplatform').controller('XplatformPlayerModalCtrl', ['$scope', '$modalInstance', 'title',
                function ($scope, $modalInstance, title) {      
                    $scope.content = {
                        fileTitle: title
                    }
                    $scope.ok = function () {
                        $modalInstance.close($scope.content.fileTitle);
                    };
                }
            ]
        );

        angular.module('xplatform').controller('XplatformPlayerCtrl', ['$scope', 'Recordings', 'RecordingsPlayerFactory', '$stateParams', '$timeout', 'hotkeys', '$modal', '$http', 'User',
            function($scope, Recordings, RecordingsPlayerFactory, $stateParams, $timeout, hotkeys, $modal, $http, User) {

                hotkeys.add({
                    combo: 'shift+left',
                    description: 'Move backward by 15 seconds',
                    callback: function () {
                        $scope.moveBySeconds(-15);
                    }
                });
                
                hotkeys.add({
                    combo: 'shift+right',
                    description: 'Move forward by 15 seconds',
                    callback: function () {
                        $scope.moveBySeconds(15);
                    }
                });

                hotkeys.add({
                    combo: 'shift+space',
                    description: 'Pause/Play',
                    callback: function () {
                        $scope.state.isPlaying = !$scope.state.isPlaying;
                    }
                });

                User.getUserData(function (user) {
                    $scope.userId = user._id;
                    $http.get('/api/player/' + $scope.userId).success(function (files) {
                        $scope.files = files;
                    });
                });

                $scope.saveFile = function () {
                    var modalInstance = $modal.open({
                        templateUrl: path + '/xplatform-player-modal.html',
                        controller: 'XplatformPlayerModalCtrl',
                        size: 'sm',
                        resolve: {
                            title: function () {
                                return $scope.fileTitle;      
                            }
                        }
                    });

                    modalInstance.result.then(function (title) {
                        $scope.fileTitle = title;

                        var fileToSave = {
                            title: $scope.fileTitle, 
                            recordingId: $stateParams.id,
                            userId: $scope.userId,
                            second: $scope.state.currentSecond,
                            slide: $scope.slide,
                            date: new Date()
                        };   

                        $http.post('/api/player', fileToSave).success(function (){
                        });
                    
                        $scope.files.push(fileToSave);
                    });
                };

                $scope.openFile = function (index) {
                    $scope.state.isPlaying = false;

                    var file = $scope.files[index];
                    $scope.state.currentSecond = file.second;
                    $timeout(function() {
                        $scope.slide = file.slide;
                    }, 500);
                };
                   
                $scope.fileTitle = '';

                $scope.state = {
                    currentSecond: 0,
                    maxSecond: 100,
                    timeDelay: 0,
                    videoUrl: '',
                    isPlaying: false,
                    videoLength: 0,
                    
                    activeChapterIndex: -1,
                    activeChapterLength: 0,
                    activeChapterSecond: 0,
                    activeChapterPercentage: 0

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

                $scope.secondIsActive = function(slide, second) {
                    return slide.timestamp < second && slide.end > second;
                };

                $scope.goToSecond = function() {
                    if (!$scope.player) {
                        return;
                    }
                    $scope.updateChapterData();
                    $scope.player.goToSecond($scope.state.currentSecond + parseInt($scope.state.timeDelay));
                };


                $scope.jumpTo = function(index) {
                    var chapter = $scope.chapters[index];
                    var second = chapter.timestamp;
                    $scope.state.isPlaying = false;
                    $timeout(function() {
                        $scope.state.currentSecond = second;
                        $scope.state.isPlaying = true;
                    }, 500);
                };

                $scope.moveBySeconds = function(seconds) {
                    $scope.state.isPlaying = false;
                    $timeout(function() {
                        $scope.state.currentSecond += seconds;
                        $scope.state.isPlaying = true;
                    }, 500);
                };
               
                $scope.timeForChapter = function(index) {
                    var chapter = $scope.chapters[index];
                    return (new Date((chapter.end - chapter.timestamp) * 1000));
                };

                var updatePercentage = _.throttle(function (){
                    $scope.state.activeChapterPercentage = $scope.state.activeChapterSecond/$scope.state.activeChapterLength * 100;
                }, 200, {
                    leading: true,
                    trailing: false
                });

                $scope.updateChapterData = function () {
                    $scope.state.activeChapterIndex = _.findIndex($scope.chapters, function (chapter) {
                        return chapter.end > $scope.state.currentSecond;
                    });
                    var chapter = $scope.chapters[$scope.state.activeChapterIndex];
                    $scope.state.activeChapterSecond = $scope.state.currentSecond - chapter.timestamp;
                    updatePercentage();
                };


                $scope.$watch('state.currentSecond', function(newVal, oldVal) {
                    if (newVal === oldVal) {
                        return;
                    }
                    $scope.goToSecond();
                });

                $scope.$watch('state.activeChapterIndex', function(newVal, oldVal) {
                    if ($scope.chapters) {
                        var chapter = $scope.chapters[newVal];
                        $scope.fileTitle = chapter.name;
                        $scope.state.activeChapterLength = chapter.end - chapter.timestamp;
                        $scope.state.activeChapterSecond = $scope.state.currentSecond - chapter.timestamp;
                    }
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
