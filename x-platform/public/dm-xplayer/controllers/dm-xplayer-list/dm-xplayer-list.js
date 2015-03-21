define([
  '_',
  'dm-xplayer/dm-xplayer-app',
  'dm-xplayer/services/dm-recordings'
], function(_, xplayerApp) {
  'use strict';

  xplayerApp.controller('dmXplayerList', ['$scope', 'dmRecordings', function($scope, dmRecordings) {
    dmRecordings.getList().then(function(recordings) {
      $scope.groups = _.groupBy(recordings.data, function(rec){
        return rec.group;
      }).sort(function(g1, g2){
        return g1.recordings[0].date < g2.recordings[0].date;
      });
    });
  }]);

});
