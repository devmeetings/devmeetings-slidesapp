/* globals define */
define(['angular', './dm-wavesurfer.html!text'], function (angular, viewTemplate) {
  'use strict';
  angular.module('dm-wavesurfer', []).directive('dmWavesurfer', ['$timeout', '$window',
    function ($timeout, $window) {
      return {
        restrict: 'E',
        scope: {
          dmSrc: '=',
          dmCurrentSecond: '=',
          dmStartSecond: '=',
          dmIsPlaying: '=',
          dmScroll: '@',
          dmDuration: '=',
          dmOnEnd: '&',
          dmPlaybackRate: '=',
          dmSetSecond: '='
        },
        replace: true,
        template: viewTemplate,
        link: function (scope, element, attrs) {
          scope.styles = [{
            left: 0,
            width: 0
          }];
          scope.positionStyle = {
            width: 0
          };

          scope.duration = 0;

          var ready = false;
          var audio = element.find('audio')[0];
          audio.volume = 1.0;

          scope.$watch('dmPlaybackRate', function () {
            audio.playbackRate = scope.dmPlaybackRate || 1.0;
            audio.defaultPlaybackRate = audio.playbackRate;

            if (audio.playbackRate > 3) {
              audio.volume = 0;
            } else {
              audio.volume = 1.0;
            }
          });

          scope.$watch('dmSrc', function () {
            while (audio.firstChild) {
              audio.removeChild(audio.firstChild);
            }
            if (!scope.dmSrc) {
              return;
            }
            [scope.dmSrc, scope.dmSrc.replace('.ogg', '.mp3')].map(function (file) {
              var src = $window.document.createElement('source');
              src.src = file;
              src.type = 'audio/' + file.substr(file.length - 3);
              audio.appendChild(src);
            });
          });

          scope.$watch('dmSetSecond', function () {
            if (!scope.dmSetSecond) {
              return;
            }
            audio.currentTime = scope.dmSetSecond;
            scope.dmCurrentSecond = scope.dmSetSecond;
            updatePosition();
          });

          audio.addEventListener('progress', function () {
            scope.$apply(function () {
              for (var i = 0; i < audio.buffered.length; i++) {
                var start = audio.buffered.start(i);
                var end = audio.buffered.end(i);
                var left = start / audio.duration * 100 + '%';
                var width = (end - start) / audio.duration * 100 + '%';

                if (scope.styles[i]) {
                  scope.styles[i].left = left;
                  scope.styles[i].width = width;
                  continue;
                }
                scope.styles.push({
                  left: left,
                  width: width
                });
              }
            });
          }, false);

          audio.addEventListener('durationchange', function () {
            scope.$apply(function () {
              scope.duration = audio.duration;

              if (!attrs.dmDuration) {
                return;
              }
              scope.dmDuration = audio.duration;
            });
          }, false);

          audio.addEventListener('canplaythrough', function (data) {
            if (ready && audio.paused) {
              return;
            }

            if (!ready && scope.dmStartSecond) {
              audio.currentTime = scope.dmStartSecond; // start from last position
            }
            ready = true;
            audio.play();
          }, false);

          var updatePosition = function () {
            scope.positionStyle.width = (audio.currentTime / audio.duration) * 100 + '%';
          };

          audio.addEventListener('timeupdate', function () {
            scope.$apply(function () {
              scope.dmCurrentSecond = audio.currentTime;
              updatePosition();
            });
          });

          audio.addEventListener('ended', function () {
            scope.$apply(function () {
              scope.dmOnEnd();
            });
          });

          var onPlayPause = function () {
            if (!attrs.dmIsPlaying) {
              return;
            }
            scope.$apply(function () {
              scope.dmIsPlaying = !audio.paused;
            });
          };

          audio.addEventListener('play', onPlayPause);
          audio.addEventListener('pause', onPlayPause);

          scope.$watch('dmIsPlaying', function () {
            if (scope.dmIsPlaying) {
              audio.play();
            } else {
              audio.pause();
            }
          });

          scope.$watch('dmStartSecond', function () {
            if (!ready) {
              return;
            }
            audio.currentTime = scope.dmStartSecond;
          });

          scope.waveClicked = function (event) {
            var width = parseInt(element.css('width').replace(/px/, ''), 10);
            var clickX = event.clientX - element.offset().left;
            var position = clickX / width;
            audio.currentTime = position * audio.duration;
            scope.dmCurrentSecond = audio.currentTime;
            updatePosition();
          };
        }
      };
    }
  ]);
});
