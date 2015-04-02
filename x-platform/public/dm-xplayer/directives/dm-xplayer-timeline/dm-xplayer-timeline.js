define([
  'dm-xplayer/dm-xplayer-app',
], function(xplayerApp) {
  'use strict';

  xplayerApp.directive('dmXplayerTimeline', [
    function() {
      return {
        restrict: 'E',
        scope: {
          state: '=',
          recording: '=',
          annotations: '='
        },
        templateUrl: '/static/dm-xplayer/directives/dm-xplayer-timeline/dm-xplayer-timeline.html',

        link: function(scope) {

          scope.$watch('recording', function(recording) {
            if (!recording) {
              return;
            }
          });

          scope.$watch('state.currentSecond', function(second){
            scope.value = second * 100 / scope.state.max;
          });

        }
      };
    }
  ]);
});
