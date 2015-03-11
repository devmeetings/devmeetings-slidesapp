define([
  '$', '_',
  'dm-xplayer/dm-xplayer-app',
  'services/RecordingsPlayerFactory'
], function($, _, xplayerApp) {
  'use strict';


  xplayerApp.directive('dmXplayer', [
    'RecordingsPlayerFactory', '$timeout',
    function(RecordingsPlayerFactory, $timeout) {
      return {
        restrict: 'E',
        scope: {
          state: '=',
          recording: '=',
          annotations: '=',
        },
        templateUrl: '/static/dm-xplayer/directives/dm-xplayer/dm-xplayer.html',

        link: function($scope) {
          $scope.$watch('recording', function(recording) {
            if (!recording) {
              return;
            }
            var layout = recording.layout || null;
            $scope.recordingPlayer = RecordingsPlayerFactory(recording, function(slide) {
              $scope.slide = slide;
              if (layout && slide.workspace) {
                slide.workspace.layout = layout;
              }
            });
            goToSecond();
          });


          $scope.runNext = function() {
            $scope.showAnno = false;
            $timeout(function() {
              $scope.state.isPlaying = true;
            }, 1000);
          };


          $scope.nextStop = 0.1;
          $scope.maxNextStop = 10000;

          var goToSecond = function(curr, prev) {
            if (!$scope.recordingPlayer) {
              return;
            }
            var second = $scope.state.currentSecond;
            var anno;

            $scope.recordingPlayer.goToSecond(second);


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


              // TODO [ToDr] Fix me please :(
              // Changing position of subtitles
              var myself = $('.dm-player-subtitles');

              setTimeout(function() {
                var cursor = $('.editor-focus .ace_cursor')[0];
                cursor = cursor || $('.ace_cursor')[0];

                var rect = cursor.getBoundingClientRect();
                var positionTop = Math.max(20, rect.top - (myself.height() - 40) / 2);
                positionTop = Math.min(Math.max(document.documentElement.clientHeight, window.innerHeight || 0) - 200, positionTop);
                var middle = document.documentElement.clientWidth / 2;  

                myself.css({
                  transform: 'translate(' + (middle + rect.left / 50) + 'px, ' + positionTop +'px) scale(1.0)',
                });

                if ($scope.anno) {
                  myself.toggleClass('small', !$scope.anno.description);
                }
              }, 450);
            } else if (Math.abs(curr - prev) > 3) {
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
        }
      };
    }
  ]);
});
