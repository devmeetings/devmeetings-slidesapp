define([
  'dm-xplayer/dm-xplayer-app',
  'dm-xplayer/services/dm-recordings'
], function(xplayerApp) {
  'use strict';

  xplayerApp.controller('dmXplayerList', ['$scope', 'dmRecordings', function($scope, dmRecordings) {
    dmRecordings.getList().then(function(recordings) {
      $scope.recordings = recordings.data;
    });
  }]);

});
