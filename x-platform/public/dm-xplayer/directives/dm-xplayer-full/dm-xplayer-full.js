define([
  'dm-xplayer/dm-xplayer-app',
  'dm-xplayer/directives/dm-xplayer/dm-xplayer',
  'dm-xplayer/directives/dm-xplayer-timeline/dm-xplayer-timeline',
], function(xplayerApp) {
  'use strict';

  xplayerApp.directive('dmXplayerFull',
    function() {
      return {
        restrict: 'E',
        scope: {
          state: '=',
          recording: '=',
          annotations: '=',
          audioUrl: '=',
          onFirstRun: '&'
        },
        templateUrl: '/static/dm-xplayer/directives/dm-xplayer-full/dm-xplayer-full.html',
      };
    }
  );

});