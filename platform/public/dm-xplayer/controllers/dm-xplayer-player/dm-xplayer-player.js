define(['dm-xplayer/dm-xplayer-app'], function(xplayerApp) {
  'use strict';

  xplayerApp.controller('dmXplayerPlayer', ['$scope', '$stateParams', '$timeout', 'dmRecordings',
    function($scope, $stateParams, $timeout, dmRecordings) {
      if (!$stateParams.id) {
        return;
      }
      $scope.state = {
        isPlaying: false,
        currentSecond: 1,
        rate: 1000,
        max: 0
      };
      $scope.annotations = [];

      dmRecordings.getRecording($stateParams.id).then(function(recording) {
        $scope.recording = recording;
        $scope.state.max = recording.slides[recording.slides.length - 1].timestamp / 1000;
      });


      $scope.$watch('state.isPlaying', function() {
        playerTick();
      });

      $scope.move = function(ev) {
        $scope.state.currentSecond = ev.offsetX / ev.target.clientWidth * $scope.state.max;
      };

      function playerTick() {
        var step = 1000.0 / $scope.state.rate;

        if ($scope.state.currentSecond > $scope.state.max) {
          $scope.state.isPlaying = false;
        }

        if (!$scope.state.isPlaying) {
          return;
        }

        var s = $scope.state.currentSecond;
        $scope.state.currentSecond = s + 0.1;

        $timeout(playerTick, step);
      }

    }
  ]);

});
