define(['dm-xplayer/dm-xplayer-app'], function(xplayerApp) {
  'use strict';

  xplayerApp.controller('dmXplayerPlayer',
    function($scope, $stateParams, dmRecordings, dmPlayer) {
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

      dmRecordings.getAutoAnnotations($stateParams.id).then(function(annotations){
        $scope.annotations = annotations;
      });

      dmRecordings.getRecording($stateParams.id).then(function(recording) {
        $scope.recording = recording;
        $scope.state.max = recording.slides[recording.slides.length - 1].timestamp / 1000;

        dmPlayer.setRecorderSource(null);
      });
    }
  );

});
