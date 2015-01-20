define(['angular', 'xplatform/xplatform-app', '_',
  'xplatform/services/dm-events/dm-events'
], function(angular, xplatformApp, _) {
  'use strict';
  xplatformApp.controller('dmXplatformPlayer', ['$scope', '$stateParams', '$timeout', 'dmEvents', 'dmRecordings', function($scope, $stateParams, $timeout, dmEvents, dmRecordings) {

    $scope.state = dmEvents.getState($stateParams.event, $stateParams.material);

    dmEvents.getEvent($stateParams.event, false).then(function(data) {
      var material = _.find(data.iterations[$stateParams.iteration].materials, function(elem) {
        return elem._id === $stateParams.material;
      });
      return dmRecordings.getRecording(material.material);
    }).then(function(recording) {
      $scope.recording = recording;
      $scope.state.max = recording.slides[recording.slides.length - 2].timestamp / 1000;
    });

    function fetchAnnotations() {
      dmEvents.getEventMaterial($stateParams.event, $stateParams.iteration, $stateParams.material).then(function(material) {
        if (!$stateParams.withVoice) {
          $scope.annotations = material.annotations.sort(function(a, b) {
            return a.timestamp - b.timestamp;
          }).filter(function(anno) {
            return anno.type !== 'snippet';
          });
        }
      });
    }

    fetchAnnotations();
    $scope.$on('newAnnotations', fetchAnnotations);

  }]);
});
