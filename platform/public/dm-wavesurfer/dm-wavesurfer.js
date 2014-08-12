'use strict';
angular.module('dm-wavesurfer', []).directive('dmWavesurfer', ['$timeout', function ($timeout) {
    
    var wavesurfer = Object.create(WaveSurfer);
    
    return {
        restrict: 'E',
        scope: {
            dmSrc: '=',
            dmCurrentSecond: '=',
            dmStartSecond: '=',
            dmIsPlaying: '=',
            dmScroll: '@'
        },
        replace: true,
        templateUrl: '/static/dm-wavesurfer/dm-wavesurfer.html',
        link: function (scope, element) {
            var options = {
                container: element[0], 
                waveColor: 'rgb(37,37,37)',
                progressColor: '#5aabcb', 
                loaderColor: 'purple',
                cursorColor: '#5aabcb',
                selectionColor: 'rgba(110,110,110,1)',
                markerWidth: 2,
                minPxPerSec: 10,
                scrollParent: scope.dmScroll === 'true' ? true : false,
                height: 100
            };


            wavesurfer.init(options);

            scope.$watch('dmSrc', function () {
                if (scope.dmSrc === '' || !scope.dmSrc) {
                    return;
                }

                wavesurfer.load(scope.dmSrc);
                //wavesurfer.load('/static/example.ogg');
            });

            wavesurfer.on('ready', function () {
                
                var checkPlaying = function () {
                    scope.dmIsPlaying ? wavesurfer.play() : wavesurfer.pause();
                };

                wavesurfer.seekAndCenter(scope.dmStartSecond);
                scope.$watch('dmStartSecond', function () {
                    if (!scope.dmStartSecond) {
                        return;
                    }
                    wavesurfer.seekAndCenter(scope.dmStartSecond / wavesurfer.getDuration());
                    checkPlaying();
                });

                scope.$watch('dmIsPlaying', function () {
                    checkPlaying();
                });
            });

            wavesurfer.on('progress', function (progress) {
                $timeout(function () {
                    scope.dmCurrentSecond = wavesurfer.getCurrentTime();
                });
            });
        
        }
    }
}]);
