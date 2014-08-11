'use strict';
angular.module('dm-wavesurfer', []).directive('dmWavesurfer', [function () {
    
    var wavesurfer = Object.create(WaveSurfer);
    
    return {
        restrict: 'E',
        scope: {
            dmSrc: '=',
            dmCurrentSecond: '=',
            dmStartSecond: '=',
            dmIsPlaying: '=',
            dmHeight: '@'
        },
        replace: true,
        templateUrl: '/static/dm-wavesurfer/dm-wavesurfer.html',
        link: function (scope, element) {
            var options = {
                container: element[0], 
                waveColor: 'red',
                progressColor: 'rgba(255,0,0,1)',
                loaderColor: 'purple',
                cursorColor: 'rgba(0,255,0,1)',
                selectionColor: 'rgba(110,110,110,1)',
                markerWidth: 2,
                minPxPerSec: 10,
                scrollParent: true,
                height: 200
            };

            wavesurfer.init(options);

            scope.watch('dmSrc', function () {
                if (scope.dmSrc === '' || !scope.dmSrc) {
                    return;
                }

                //wavesurfer.load(scope.dmSrc);
                wavesurfer.load('/static/example.ogg');
            });

            wavesurfer.on('ready', function () {
                wavesurfer.seekAndCenter(scope.dmStartSecond);
                scope.$watch('dmStartSecond', function () {
                    if (!scope.dmStartSecond) {
                        return;
                    }
                    wavesurfer.seekAndCenter(scope.dmStartSecond / wavesurfer.getDuration());
                });

                scope.$watch('dmIsPlaying', function () {
                    if (scope.isPlaying) {
                        wavesurfer.play();
                    } else {
                        wavesurfer.pause();
                    }
                });
            });

            wavesurfer.on('progress', function (progress) {
                scope.dmCurrentSecond = wavesurfer.getCurrentTime();
            });
        
        }
    }
}]);
