/* globals define */
define(['dm-xplayer/dm-xplayer-app'], function (xplayerApp) {
  'use strict';

  xplayerApp.controller('dmXplayerPlayer',
    function ($scope, $stateParams, dmRecordings) {
      if (!$stateParams.id) {
        return;
      }

      $scope.state = {
        isPlaying: false,
        currentSecond: 1,
        rate: 100,
        max: 0
      };

      $scope.annotations = [];

      dmRecordings.getAutoAnnotations($stateParams.id).then(function (annotations) {
        $scope.annotations = annotations;
      });

      dmRecordings.preparePlayerForRecording($scope.recorder, $stateParams.id).then(function (data) {
        $scope.recording = data.recording;
        $scope.state.max = data.max;
      });
    }
  );
});
