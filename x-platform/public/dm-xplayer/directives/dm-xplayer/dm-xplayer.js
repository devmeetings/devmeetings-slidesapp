/* globals define */
define([
  '$', '_',
  './dm-xplayer.html!text',
  'dm-xplayer/dm-xplayer-app',
  'dm-xplayer/services/dm-player-factory'
], function ($, _, viewTemplate, xplayerApp) {
  'use strict';

  xplayerApp.directive('dmXplayer',
    function (dmPlayerFactory, $rootScope, $timeout, $window) {
      return {
        restrict: 'E',
        scope: {
          state: '=',
          recording: '=',
          annotations: '=',
          withSidebar: '=',
          onFirstRun: '&',
          recorder: '='
        },
        template: viewTemplate,
        link: function ($scope) {
          var recordingPlayer = null;

          $scope.$watch('recording', function (recording) {
            if (!recording) {
              recordingPlayer = null;
              return;
            }
            var layout = (recording.original ? recording.original.layout : null) || null;
            recordingPlayer = dmPlayerFactory(recording, function (slide) {
              $scope.slide = slide;
              // TODO [ToDr] Temporary (viewing of notes)
              $rootScope.slide = {
                slide: slide,
                mode: 'player'
              };
              if (layout && slide.workspace) {
                slide.workspace.layout = layout;
              }
              $scope.$broadcast('slide:update');
            });
            recordingPlayer.setIsPlaying(false);
            goToSecond();
          });

          $scope.runNext = function () {
            $scope.hideBtn = true;
            if ($scope.state.firstRun) {
              $scope.onFirstRun();
            }

            makeSubtitlesFixed();
            $timeout(function () {
              $scope.state.firstRun = false;
              $scope.state.currentSecond += 0.01;
              $scope.state.isPlaying = true;
            }, 150);
          };

          $scope.state.firstRun = true;

          function selectNewAnnotation (second) {
            var annotations = $scope.annotations;
            if (!annotations) {
              return;
            }

            function setIfHasAnno (name, idx) {
              var anno = annotations[idx];
              $scope.state[name] = anno ? anno.timestamp : null;
            }

            var nextAnnotationIdx = _.sortedIndex(annotations, {
              timestamp: second
            }, 'timestamp');
            $scope.currentAnnotation = annotations[nextAnnotationIdx - 1];

            setIfHasAnno('playFrom', nextAnnotationIdx - 1);
            setIfHasAnno('playTo', nextAnnotationIdx);
            setIfHasAnno('nextPlayTo', nextAnnotationIdx + 1);
          }

          var goToSecond = function (curr, prev) {
            if (!recordingPlayer) {
              return;
            }
            var second = $scope.state.currentSecond;
            recordingPlayer.goToSecond(second);

            selectNewAnnotation(second);
          };

          $scope.$watch('currentAnnotation', fixSubtitlePosition);
          $scope.$watch('annotations', function () {
            selectNewAnnotation($scope.state.currentSecond);
          });
          $scope.$watch('state.currentSecond', goToSecond);
          $scope.$watch('state.isPlaying', function (isPlaying) {
            if (isPlaying) {
              $scope.hideBtn = true;
              $scope.state.firstRun = false;
              makeSubtitlesFixed();
            } else {
              fixSubtitlePosition();
            }

            if (recordingPlayer) {
              recordingPlayer.setIsPlaying(!!isPlaying);
            }
          });

          $window.addEventListener('resize', fixSubtitlePosition);
          $scope.$on('$destroy', function () {
            $window.removeEventListener('resize', fixSubtitlePosition);
          });

          $timeout(fixSubtitlePosition, 200);
        }
      };
    }
  );

  function makeSubtitlesFixed () {
    $('.dm-player-subtitles.moveable').addClass('faded');
  }

  function fixSubtitlePosition () {
    // TODO [ToDr] Fix me please :(
    // Changing position of subtitles
    var myself = $('.dm-player-subtitles.moveable');
    myself.removeClass('faded');

    setTimeout(function () {
      var cursor = $('.sw-editor-active .ace_cursor')[0];
      cursor = cursor || $('.ace_cursor')[0];
      if (!cursor) {
        return;
      }
      var rect = cursor.getBoundingClientRect();
      var viewportHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0) - 50;
      var viewportWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0) - 50;
      var positionTop = Math.max(20, rect.bottom + 30);
      positionTop = Math.min(viewportHeight - 10, positionTop);

      var translateLeft = Math.min(parseInt(250 + rect.left, 10), viewportWidth - myself.width());
      var translateBottom = parseInt(viewportHeight - positionTop - myself.height(), 10);

      myself.css({
        bottom: translateBottom + 'px',
        left: translateLeft + 'px'
      });
    }, 100);
  }
});
