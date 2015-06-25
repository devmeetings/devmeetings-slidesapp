/* globals define */
define([
  'dm-xplayer/dm-xplayer-app',
  './dm-xplayer-full.html!text',
  'dm-xplayer/directives/dm-xplayer/dm-xplayer',
  'dm-xplayer/directives/dm-xplayer-timeline/dm-xplayer-timeline',
], function (xplayerApp, viewTemplate) {
  'use strict';

  xplayerApp.directive('dmXplayerFull',
    function () {
      return {
        restrict: 'E',
        scope: {
          state: '=',
          recording: '=',
          annotations: '=',
          audioUrl: '=',
          withSidebar: '=',
          recorder: '=',
          onFirstRun: '&',
          onEnd: '&'
        },
        template: viewTemplate
      };
    }
  );

});
