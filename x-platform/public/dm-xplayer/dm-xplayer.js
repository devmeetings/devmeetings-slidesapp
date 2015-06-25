define([
  'dm-xplayer/dm-xplayer-app',
  './controllers/dm-xplayer-list/dm-xplayer-list.html!text',
  './controllers/dm-xplayer-player/dm-xplayer-player.html!text',
  'dm-xplayer/directives/dm-xplayer/dm-xplayer',
  'dm-xplayer/directives/dm-xplayer-full/dm-xplayer-full',
  'dm-xplayer/directives/dm-xplayer-ticker/dm-xplayer-ticker',
  'dm-xplayer/directives/dm-timeline/dm-timeline',
  'dm-xplayer/directives/dm-xplayer-timeline/dm-xplayer-timeline',
  'dm-xplayer/controllers/dm-xplayer-list/dm-xplayer-list',
  'dm-xplayer/controllers/dm-xplayer-player/dm-xplayer-player',
], function (xplayerApp, listView, playerView) {
  'use strict';

  xplayerApp.config(['$stateProvider', function ($stateProvider) {
    $stateProvider.state('index.player', {
      url: '/player/:id',
      views: {
        left: {
          template: listView
        },
        mid: {
          template: playerView
        }
      },

      onEnter: function ($rootScope) {
        $rootScope.xplatformData.navbar = {
          showTitle: true,
          title: 'Player',
          searchText: ''
        };
        $rootScope.xplatformData.columns = {
          left: 2,
          mid: 10,
          right: 0
        };
        $rootScope.headerHidden = true;
      },

      onExit: function ($rootScope) {
        $rootScope.headerHidden = false;
      }
    });

  }]);

  return xplayerApp;

});
