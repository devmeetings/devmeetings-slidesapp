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
            var layout = (recording.original ? recording.original.layout : null) || null;
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
              if (!$scope.state.isPlaying) {
                $scope.$broadcast('update');
              }
            });
            recordingPlayer.setIsPlaying(false);
            goToSecond();
          });


          $scope.runNext = function() {
            $scope.hideBtn = true;
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

              anno = _.find($scope.annotations, function(anno) {
                return anno.timestamp > second;
              });
              if (anno) {
                $scope.nextStop = anno.timestamp;
                $scope.next = anno;
              } else {
                $scope.nextStop = $scope.maxNextStop;
              }

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
              $scope.hideBtn = true;
              $scope.state.firstRun = false;
            }

            if (recordingPlayer) {
              recordingPlayer.setIsPlaying(!!isPlaying);
            }
          });
        }
      };
    }
  );
});
