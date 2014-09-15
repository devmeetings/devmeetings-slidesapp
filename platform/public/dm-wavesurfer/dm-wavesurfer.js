'use strict';
angular.module('dm-wavesurfer', []).directive('dmWavesurfer', ['$timeout', function ($timeout) {
    return {
        restrict: 'E',
        scope: {
            dmSrc: '=',
            dmCurrentSecond: '=',
            dmStartSecond: '=',
            dmIsPlaying: '=',
            dmScroll: '@',
            dmDuration: '=',
            dmOnEnd: '='
        },
        replace: true,
        templateUrl: '/static/dm-wavesurfer/dm-wavesurfer.html',
        link: function (scope, element) {
            scope.ranges = [{
                start: 0,
                end: 0
            }];
            var ready = false;
            var audio = element.find('audio')[0];
           
            audio.addEventListener('progress', function () {
                scope.$apply(function () {
                    for (var i = 0; i < audio.buffered.length; i++) {
                        if (scope.ranges[i]) {
                            scope.ranges[i].start = audio.buffered.start(i);
                            scope.ranges[i].end = audio.buffered.end(i);
                            continue; 
                        }
                        scope.ranges.push({
                            start: audio.buffered.start(i),
                            end: audio.buffered.end(i)
                        });
                    }
                });
            }, false);

            audio.addEventListener('durationchange', function () {
                scope.$apply(function () {
                    scope.dmDuration = audio.duration;
                });
            }, false);

            audio.addEventListener('canplay', function (data) {
                ready = true;
                audio.play();
            }, false);

            audio.addEventListener('timeupdate', function () {
                scope.$apply(function () {
                    scope.dmCurrentSecond = audio.currentTime;
                });
            });

            audio.addEventListener('ended', function () {
                scope.$apply(function () {
                    scope.dmOnEnd();
                });
            });

            var onPlayPause = function () {
                scope.$apply(function () {
                    scope.dmIsPlaying = !audio.paused;
                });
            };

            audio.addEventListener('play', onPlayPause);
            audio.addEventListener('pause', onPlayPause);


            scope.$watch('dmIsPlaying', function () {
                scope.dmIsPlaying ? audio.play() : audio.pause();
            });

            scope.$watch('dmStartSecond', function () {
                if (!ready) {
                    return;
                }
                audio.currentTime = scope.dmStartSecond;
            });

            scope.waveClicked = function (event) {
                var width = parseInt(element.css('width').replace(/px/, ''));
                var clickX = event.pageX;
                var position = clickX / width;
                audio.currentTime = position * scope.dmDuration;
                scope.dmCurrentSecond = audio.currentTime;
            };
        }
    }
}]);

