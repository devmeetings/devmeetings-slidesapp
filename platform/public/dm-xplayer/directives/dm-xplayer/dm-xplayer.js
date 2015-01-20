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
            $scope.recordingPlayer = RecordingsPlayerFactory(recording, function(slide) {
              $scope.slide = slide;
            });
            goToSecond();
          });


          $scope.runNext = function() {
            $scope.starting = true;
            $timeout(function() {
              $scope.state.isPlaying = true;
              $scope.starting = false;
            }, 1000);
          };


          $scope.nextStop = 0.1;
          $scope.maxNextStop = 10000;

          var goToSecond = _.throttle(function(curr, prev) {
            if (!$scope.recordingPlayer) {
              return;
            }
            var second = $scope.state.currentSecond;
            var anno;

            $scope.recordingPlayer.goToSecond(second);


            if (second > $scope.nextStop) {
              $scope.anno = $scope.next;
              $scope.minimized = false;
              $scope.state.isPlaying = false;

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
                var rect = $('.ace_cursor')[0].getBoundingClientRect();
                var positionTop = Math.max(20, rect.top - (myself.height() - 40) / 2);
                positionTop = Math.min(Math.max(document.documentElement.clientHeight, window.innerHeight || 0) - 200, positionTop);

                myself.css({
                  left: 'calc(45% + ' + (rect.left / 50) + 'px)',
                  top: positionTop + 'px'
                });
                myself.toggleClass('small', !$scope.anno.description);
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
          }, 3);

          $scope.$watch('state.currentSecond', goToSecond);
        }
      };
    }
  ]);
});
