define([
  'dm-xplayer/dm-xplayer-app',
  'dm-xplayer/directives/dm-xplayer/dm-xplayer',
  'dm-xplayer/directives/dm-xplayer-timeline/dm-xplayer-timeline',
  'dm-xplayer/directives/dm-xplayer-ticker/dm-xplayer-ticker',
  'dm-xplayer/controllers/dm-xplayer-list/dm-xplayer-list',
  'dm-xplayer/controllers/dm-xplayer-player/dm-xplayer-player',
], function(xplayerApp) {
  'use strict';

  xplayerApp.config(['$stateProvider', function($stateProvider) {

    $stateProvider.state('index.player', {
      url: '/player/:id',
      views: {
        left: {
          templateUrl: '/static/dm-xplayer/controllers/dm-xplayer-list/dm-xplayer-list.html'
        },
        mid: {
          templateUrl: '/static/dm-xplayer/controllers/dm-xplayer-player/dm-xplayer-player.html'
        }
      },

      onEnter: function($rootScope) {
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

      onExit: function($rootScope) {
        $rootScope.headerHidden = false;
      }
    });

  }]);

  return xplayerApp;

});
