define(['dm-xplayer/dm-xplayer-app'], function(xplayerApp){
  'use strict';

  xplayerApp.controller('dmXplayerPlayer', 
    ['$scope', '$stateParams', '$timeout', 'dmRecordings',
    function($scope, $stateParams, $timeout, dmRecordings) {
      if (!$stateParams.id) {
        return;
      }
      $scope.state = {
        isPlaying: false,
        currentSecond: 1,
        rate: 1000
      };
      $scope.annotations = [];

      dmRecordings.getRecording($stateParams.id).then(function(recording) {
        $scope.recording = recording;
      });

        
      $scope.$watch('state.isPlaying', function() {
        playerTick(); 
      });

      function playerTick() {
        var step = 1000.0 / $scope.state.rate;
        if (!$scope.state.isPlaying) {
          return;
        }
        var s = $scope.state.currentSecond;
        $scope.state.currentSecond = s + 0.1;
        
        $timeout(playerTick, step);
      }

  }]);

});
