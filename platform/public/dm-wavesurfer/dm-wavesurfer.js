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

            (function () {
                var $progress = element[0].querySelector('.progress');
                var $progressBar = element[0].querySelector('.progress-bar');
                var $wave = element[0].querySelector('wave');

                $progress.style.margin = '0px 0px 50px 0px';
                $progress.style['border-radius'] = '0px';

                var showProgress = function (percent) {
                    $progress.style.display = 'block';
                    $wave.style.display = 'none';
                    $progressBar.style.width = percent + '%';
                };

                var hideProgress = function () {
                    $progress.style.display = 'none';
                    $wave.style.display = 'block';
                };

                wavesurfer.on('loading', showProgress);
                wavesurfer.on('ready', hideProgress);
                wavesurfer.on('destroy', hideProgress);
                wavesurfer.on('error', hideProgress);
            }());
        
            scope.$on('$destroy', function () {
                wavesurfer.destroy();
            });
        }
    }
}]);