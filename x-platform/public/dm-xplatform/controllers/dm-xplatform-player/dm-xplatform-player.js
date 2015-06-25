define(['angular', 'xplatform/xplatform-app', '_',
  'xplatform/services/dm-events/dm-events',
  'dm-modules/dm-keys/keysListener.es6'
], function(angular, xplatformApp, _, dmEvents, keysListener) {
  'use strict';
  xplatformApp.controller('dmXplatformPlayer', function($scope, $stateParams, $timeout, dmEvents, dmRecordings, dmBrowserTab, $modal) {


    $scope.state = dmEvents.getState($stateParams.event, $stateParams.material);

    $scope.$on('$destroy', function() {
      // next time we will be here, just continue
      $scope.state.startSecond = $scope.state.currentSecond;
    });

    $scope.withVoice = $stateParams.withVoice;

    $scope.keys.keyUp = keysListener($scope);


    dmEvents.getEvent($stateParams.event, false).then(function(data) {
      $scope.event = data;
      $scope.currentIteration = data.iterations[$stateParams.iteration];
      var material = _.find(data.iterations[$stateParams.iteration].materials, function(elem) {
        return elem._id === $stateParams.material;
      });
      $scope.currentMaterial = material;

      $scope.audioUrl = material.url;

      dmBrowserTab.setTitleAndIcon(material.title + ' - ' + data.title, 'movie')
        .withBadge(1 + parseInt($stateParams.iteration, 10));
    });

    $scope.$watch('recorderPlayer', updatePlayerForRecording);
    $scope.$watch('currentMaterial', updatePlayerForRecording);


    function updatePlayerForRecording() {
      if (!$scope.recorderPlayer || !$scope.currentMaterial) {
        return;
      }

      dmRecordings.preparePlayerForRecording($scope.recorderPlayer, $scope.currentMaterial.material).then(function(recording) {
        $scope.recording = recording.recording;
        $scope.state.rate = recording.recording.original.playbackRate;
        $scope.state.max = recording.max;
      });
    }

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


    var modalOpen = false;
    $scope.displayFinishMessage = function() {
      if (modalOpen) {
        return;
      }

      function fromScope(name) {
        return function() {
          return $scope[name];
        };
      }

      modalOpen = true;
      $modal.open({
        templateUrl: '/static/dm-xplatform/controllers/dm-xplatform-player/player-finish.html',
        controller: 'dmXplatformPlayerFinishModal',
        size: 'md',
        resolve: {
          event: fromScope('event'),
          currentIteration: fromScope('currentIteration'),
          currentMaterial: fromScope('currentMaterial'),
          workspaceId: fromScope('workspaceId')
        },
        windowClass: 'dm-player-finish'
      });
    };
  });

  xplatformApp.controller('dmXplatformPlayerFinishModal', function($scope, event, currentIteration, currentMaterial, workspaceId) {

    $scope.iterationIdx = event.iterations.indexOf(currentIteration);
    $scope.currentMaterial = currentMaterial;
    $scope.workspaceId = workspaceId;

    if (_.last(currentIteration.materials) === currentMaterial) {
      $scope.nextTask = _.first(currentIteration.tasks);
    } else {
      var materialIdx = _.findIndex(currentIteration.materials, currentMaterial);
      $scope.nextMaterial = currentIteration.materials[materialIdx + 1];
    }

  });



});
