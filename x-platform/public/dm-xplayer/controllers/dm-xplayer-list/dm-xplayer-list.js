define([
  '_',
  'dm-xplayer/dm-xplayer-app',
  'dm-xplayer/services/dm-recordings'
], function (_, xplayerApp) {
  'use strict';

  xplayerApp.controller('dmXplayerList', ['$scope', 'dmRecordings', function ($scope, dmRecordings) {
    dmRecordings.getList().then(function (recordings) {
      $scope.groups = _.values(_.groupBy(recordings.data, function (rec) {
        return rec.group;
      })).sort(function (g1, g2) {
        return g1[0].date < g2[0].date;
      });
    });
  }]);

});
