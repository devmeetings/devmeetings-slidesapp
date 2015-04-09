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
          state: '='
        },
        templateUrl: '/static/dm-xplayer/directives/dm-xplayer-ticker/dm-xplayer-ticker.html',

        link: function($scope) {

          $scope.$watch('state.isPlaying', function() {
            playerTick();
          });

          function playerTick() {
            if ($scope.state.currentSecond > $scope.state.max) {
              $scope.state.isPlaying = false;
            }

            if (!$scope.state.isPlaying) {
              return;
            }

            var s = $scope.state.currentSecond;
            $scope.state.currentSecond = s + 0.1;

            var step = 100.0 / $scope.state.rate;
            setTimeout(function() {
              // Digest all changes before continuing
              $scope.$apply(function() {
                $timeout(playerTick, step);
              });
            });
          }

        }
      };
    }
  ]);
});
