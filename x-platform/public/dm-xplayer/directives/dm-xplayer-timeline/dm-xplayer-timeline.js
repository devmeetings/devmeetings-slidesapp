define([
  '_',
  'dm-xplayer/dm-xplayer-app',
], function(_, xplayerApp) {
  'use strict';

  xplayerApp.directive('dmXplayerTimeline',
    function($window) {
      return {
        restrict: 'E',
        scope: {
          state: '=',
          annotations: '=',
          audioUrl: '=',
          onEnd: '&'
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

          var rates = [0.75, 1.0, 1.25, 1.5, 1.75, 2.0, 3.0, 4.0, 5.0, 7.5, 10.0, 15.0, 20.0, 50.0, 100.0];
          $scope.$watch('audioUrl', function(audioUrl) {
            $scope.withVoice = !!audioUrl;
          });

          function getNextRateIndex(nextRate) {
            return (nextRate + 1) % rates.length;
          }

          $scope.$watch('state.currentSecond', function(sec) {
            if (sec >= $scope.state.max) {
              $scope.onEnd();
            } 
          });

          $scope.$watch('state.rate', function(rate) {
            if (rate) {
              var currentRateIdx = _.sortedIndex(rates, rate);
              $scope.nextRate = rates[getNextRateIndex(currentRateIdx)];
              return;
            }

            if ($scope.withVoice) {
              $scope.setRate(1.0);
            } else {
              $scope.setRate(7.5);
            }

          });

          $scope.setRate = function(rate) {
            $scope.state.rate = rate;
          };

          $scope.changeRate = function() {
            var currentRateIdx = _.sortedIndex(rates, $scope.state.rate);
            $scope.setRate(rates[getNextRateIndex(currentRateIdx)]);
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
