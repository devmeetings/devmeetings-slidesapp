define([
  '$', '_',
  'dm-xplayer/dm-xplayer-app',
  'dm-xplayer/services/dm-player-factory'
], function($, _, xplayerApp) {
  'use strict';


  xplayerApp.directive('dmXplayer',
    function(dmPlayerFactory, $rootScope, $timeout, $window) {
      return {
        restrict: 'E',
        scope: {
          state: '=',
          recording: '=',
          annotations: '=',
          withSidebar: '=',
          onFirstRun: '&'
        },
        templateUrl: '/static/dm-xplayer/directives/dm-xplayer/dm-xplayer.html',

        link: function($scope) {

          var recordingPlayer = null;

          $scope.$watch('recording', function(recording) {
            if (!recording) {
              recordingPlayer = null;
              return;
            }
            var layout = recording.layout || null;
            recordingPlayer = dmPlayerFactory(recording, function(slide) {
              $scope.slide = slide;
              // TODO [ToDr] Temporary (viewing of notes)
              $rootScope.slide = {
                slide: slide,
                mode: 'player'
              };
              if (layout && slide.workspace) {
                slide.workspace.layout = layout;
              }
            });
            goToSecond();
          });


          $scope.runNext = function() {
            $scope.showAnno = false;
            if ($scope.state.firstRun) {
              $scope.onFirstRun();
            }
            $timeout(function() {
              $scope.state.firstRun = false;
              $scope.state.isPlaying = true;
            }, 1000);
          };

          $scope.state.firstRun = true;
          $scope.nextStop = 0.1;
          $scope.maxNextStop = 10000;

          var goToSecond = function(curr, prev) {
            if (!recordingPlayer) {
              return;
            }
            var second = $scope.state.currentSecond;
            var anno;

            recordingPlayer.goToSecond(second);


            if (second >= $scope.nextStop) {
              $scope.anno = $scope.next;
              $scope.state.isPlaying = false;
              // WTF? I have no idea why sometimes annoation is not displayed.
              $timeout(function() {
                $scope.showAnno = true;
              }, 10);

              anno = _.find($scope.annotations, function(anno) {
                return anno.timestamp > second;
              });
              if (anno) {
                $scope.nextStop = anno.timestamp;
                $scope.next = anno;
              } else {
                $scope.nextStop = $scope.maxNextStop;
              }


              fixSubtitlePosition($scope);
            } else if (Math.abs(curr - prev) > 5) {
              // fix nextStop when we are going backwards or fast forward

              anno = _.find($scope.annotations, function(anno) {
                return anno.timestamp > curr;
              });
              if (anno) {
                $scope.nextStop = anno.timestamp;
                $scope.next = anno;

                var curIdx = $scope.annotations.indexOf(anno);
                if (curIdx > 0) {
                  $scope.anno = $scope.annotations[curIdx];
                }
              } else {
                $scope.nextStop = $scope.maxNextStop;
              }
            }
          };

          $scope.$watch('state.currentSecond', goToSecond);
          $scope.$watch('state.isPlaying', function(isPlaying) {
            if (isPlaying) {
              $scope.showAnno = false;
            }
          });

          $window.addEventListener('resize', fixSubtitlePosition.bind(null, $scope));
          $scope.$on('$destroy', function(){
            $window.removeEventListener('resize', fixSubtitlePosition.bind(null, $scope));
          });
        }
      };
    }
  );

  function fixSubtitlePosition($scope) {
    // TODO [ToDr] Fix me please :(
    // Changing position of subtitles
    var myself = $('.dm-player-subtitles');

    setTimeout(function() {
      var cursor = $('.editor-focus .ace_editor')[0];
      cursor = cursor || $('.ace_editor')[0];
      if (!cursor) {
        return;
      }

      var rect = cursor.getBoundingClientRect();
      var positionTop = Math.max(20, rect.bottom - myself.height());
      positionTop = Math.min(Math.max(document.documentElement.clientHeight, window.innerHeight || 0) - 10, positionTop);

      var translateLeft = parseInt(40 + rect.left, 10);
      var translateTop = parseInt(positionTop, 10);

      myself.css({
        top: translateTop + 'px',
        left: translateLeft + 'px'
      });

      if ($scope.anno) {
        myself.toggleClass('small', !$scope.anno.description);
      }
    }, 450);
  }
});
