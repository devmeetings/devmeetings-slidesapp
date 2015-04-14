define([
  'dm-xplayer/dm-xplayer-app',
], function(xplayerApp) {
  'use strict';

  xplayerApp.directive('dmXplayerTimeline',
    function($window) {
      return {
        restrict: 'E',
        scope: {
          state: '=',
          annotations: '=',
          audioUrl: '='
        },
        templateUrl: '/static/dm-xplayer/directives/dm-xplayer-timeline/dm-xplayer-timeline.html',

        link: function($scope) {
          $scope.setTime = function(time) {
            $scope.setSecond = time;
          };
          $window.setTime = function(time) {
            $scope.$apply(function() {
              $scope.setSecond = time;
            });
          };

          var rates = [0.75, 1.0, 1.25, 1.5, 1.75, 2.0, 3.0, 4.0, 5.0, 7.5, 10.0, 15.0, 20.0];
          $scope.$watch('audioUrl', function(audioUrl) {
            $scope.withVoice = !!audioUrl;

            if ($scope.withVoice) {
              $scope.state.rate = rates[0];
            } else {
              $scope.state.rate = rates[rates.length - 3];
            }
            $scope.changeRate();
          });

          $scope.changeRate = function() {
            var nextRate = rates.indexOf($scope.state.rate) + 1;
            nextRate = nextRate % rates.length;
            $scope.nextRate = rates[(nextRate + 1) % rates.length];
            $scope.state.rate = rates[nextRate];
          };

          $scope.move = function(ev) {
            var width = ev.currentTarget.clientWidth;
            var x;
            var offset = (ev.offsetX || ev.originalEvent.layerX);
            if (ev.target.clientWidth === ev.currentTarget.clientWidth) {
              // Clicking on timeline
              x = offset;

            } else {
              // Clicking on annotation
              var rect = ev.target.getBoundingClientRect();
              var parentRect = ev.target.parentElement.getBoundingClientRect();
              x = rect.left - parentRect.left;
              // Clicking on progress bar
              x = Math.max(x, offset);
            }
            $scope.state.currentSecond = x / width * $scope.state.max;
          };
        }
      };
    }
  );
});
