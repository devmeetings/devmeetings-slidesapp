define([
  'dm-xplayer/dm-xplayer-app',
], function(xplayerApp) {
  'use strict';

  xplayerApp.directive('dmXplayerTicker', [
    '$timeout',
    function($timeout) {
      return {
        restrict: 'E',
        scope: {
          state: '=',
          onEnd: '&'
        },
        templateUrl: '/static/dm-xplayer/directives/dm-xplayer-ticker/dm-xplayer-ticker.html',

        link: function($scope) {

          $scope.$watch('state.isPlaying', function() {
            playerTick();
          });

          var timeout = 100;
          var jump = 0.1;
          $scope.$watch('state.rate', function(rate) {
            var steps = 10 * rate / Math.sqrt(rate);
            jump = 0.1 * rate / Math.sqrt(rate);
            timeout = 1000.0 / steps;
          });

          function playerTick() {
            if ($scope.state.currentSecond > $scope.state.max) {
              $scope.state.isPlaying = false;
              $scope.onEnd();
            }

            if (!$scope.state.isPlaying) {
              return;
            }

            var s = $scope.state.currentSecond;
            $scope.state.currentSecond = s + jump;

            if ($scope.state.playTo && $scope.state.currentSecond >= $scope.state.playTo) {
              $scope.state.isPlaying = false;
              // Override current Second
              $scope.state.currentSecond = $scope.state.playTo;
              // And Set New PlayTo
              $scope.state.playTo = $scope.state.nextPlayTo;
              return;
            }

            setTimeout(function() {
              // Digest all changes before continuing
              $scope.$apply(function() {
                $timeout(playerTick, timeout);
              });
            });
          }

        }
      };
    }
  ]);
});
