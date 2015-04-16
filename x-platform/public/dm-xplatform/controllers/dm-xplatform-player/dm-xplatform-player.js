define(['angular', 'xplatform/xplatform-app', '_',
  'xplatform/services/dm-events/dm-events'
], function(angular, xplatformApp, _) {
  'use strict';
  xplatformApp.controller('dmXplatformPlayer', function($scope, $stateParams, $timeout, dmEvents, dmRecordings, dmBrowserTab, dmPlayer) {

    $scope.state = dmEvents.getState($stateParams.event, $stateParams.material);

    $scope.$on('$destroy', function() {
      // next time we will be here, just continue
      $scope.state.startSecond = $scope.state.currentSecond;
    });

    $scope.withVoice = $stateParams.withVoice;

    $scope.keys.keyUp = function(event) {
      if (event.keyCode !== 32 || event.target.type === 'textarea') {
        return;
      }
      $scope.state.isPlaying = !$scope.state.isPlaying;
    };


    dmEvents.getEvent($stateParams.event, false).then(function(data) {
      var material = _.find(data.iterations[$stateParams.iteration].materials, function(elem) {
        return elem._id === $stateParams.material;
      });

      $scope.audioUrl = material.url;

      dmBrowserTab.setTitleAndIcon(material.title + ' - ' + data.title, 'movie')
        .withBadge(1 + parseInt($stateParams.iteration, 10));

      return dmRecordings.preparePlayerForRecording(material.material);
    }).then(function(recording) {
      $scope.recording = recording.recording;
      $scope.state.max = recording.max;
    });

    function fetchAnnotations() {
      dmEvents.getEventAnnotations($stateParams.event, $stateParams.iteration, $stateParams.material).then(function(annotations) {
        if ($stateParams.withVoice) {
          return;
        }

        $scope.annotations = annotations.sort(function(a, b) {
          return a.timestamp - b.timestamp;
        }).filter(function(anno) {
          return anno.type !== 'snippet';
        });
      });
    }

    fetchAnnotations();
    $scope.$on('newAnnotations', fetchAnnotations);
  });
});
