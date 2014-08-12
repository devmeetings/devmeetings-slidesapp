'use strict';
angular.module('dm-video', []).directive('dmVideo', ['$timeout',
    function ($timeout) {
        return {
            restrict: 'E',
            scope: {
                dmSrc: '=',
                dmCurrentSecond: '=',
                dmStartSecond: '=',
                dmIsPlaying: '=',
                dmVideoLength: '=',
                dmControls: '@',
                dmHeight: '@',
                dmAutoHeight: '='
               
            },
            template: '<div><video class="video-js vjs-default-skin" preload="auto" width="100%" autoplay="autoplay">'
            + '</video></div>',
            link: function (scope, element) {
                var $video = element.find('video')[0];
                //if (scope.dmControls) {
                    $video.setAttribute('controls', true);
                //}
               
                if (scope.dmAutoHeight) {
                    var body = document.getElementsByClassName("player-wrapper")[0];
                    scope.body = body;
                    $video.setAttribute('height', body.clientHeight - 40);
                    
                    //scope.$watch('body.clientHeight', function (newHeight) {
                        //$video.setAttribute('height', newHeight);
                    //});
                    

                } else {
                    $video.setAttribute('height', scope.dmHeight);
                }
                
                var player = undefined;
                scope.$watch('dmSrc', function (newSrc) {
                    if (newSrc === "" || newSrc === undefined) {
                        return;
                    }

                    if (player === undefined) {
                        videojs($video, {
                            techOrder: ['youtube', 'html5'],
                            quality: '720p',
                            src: newSrc
                        }).ready (function () {
                            player = this;

                            player.on('timeupdate', function () {
                                $timeout( function () { // replace with safe apply
                                    scope.dmCurrentSecond = player.currentTime();
                                });
                            });
                            
                        
                            player.on('play', function () {
                                scope.$apply( function () {
                                    scope.dmIsPlaying = true;
                                });
                            });

                            player.on('pause', function () {
                                scope.$apply( function () {
                                    scope.dmIsPlaying = false;
                                    scope.dmCurrentSecond = Math.round(player.currentTime());
                                });
                            });

                            var goToSecond = function (newSecond) {
                                var time = Math.round(newSecond);
                                player.currentTime(time);
                            };
                           
                            //always start paused

                            
                            $timeout(function () {
                                //player.pause();  // although dmIsPlaying might be false
                                goToSecond(scope.dmStartSecond);
                            }, 1000);

                            scope.$watch('dmStartSecond', goToSecond);

                            scope.$watch('dmIsPlaying', function (newVal) {
                                $timeout (function () {
                                    if (scope.dmIsPlaying) {
                                        if (player.paused()) {
                                            player.play();
                                        } 
                                    } else {
                                        if (!player.paused()) {
                                            player.pause();
                                        }
                                    }
                                });
                            });
                        });
                    } else {
                        player.src({src: newSrc, type: 'video/youtube'});
                    }
                });
            }
        }
    }
]);
