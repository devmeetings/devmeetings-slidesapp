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
            // find max length
            scope.maxLength = recording.slides.reduce(function(max, slide) {
              return max > slide.timestamp ? max : slide.timestamp;
            }, 0);
          });

          scope.$watch('state.currentSecond', function(second){
            scope.value = second * 1000 * 100 / scope.maxLength;
          });

        }
      };
    }
  ]);
});
