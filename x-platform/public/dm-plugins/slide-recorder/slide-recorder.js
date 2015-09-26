/* globals define */
define(['module', '_', 'slider/slider.plugins', './latency-measurement'], function (module, _, sliderPlugins, latMeasurement) {
  'use strict';

  var latencyMeasurement = latMeasurement.default;

  sliderPlugins.registerPlugin('slide', '*', 'slide-recorder', {
    order: 4000,
    name: 'Recorder',
    description: 'The plugin cares about sending all the changes that user is doing on the slide to the server.',
    example: {}
  }).directive('slideRecorder', function (Sockets) {
    return {
      restrict: 'E',
      scope: {
        slide: '=context',
        mode: '=',
        path: '@',
        recorder: '='
      },
      link: function (scope) {
        // Disable recorder on some sub slides.
        if (scope.path !== '.*') {
          return;
        }

        var lastId;

        function stopRecording () {
          latencyMeasurement.disconnected();
          if (!lastId) {
            return;
          }
          var id = lastId.split('_');
          scope.recorder.stopSyncingAndSetId(id[0], id[1]);
        }

        Sockets.on('disconnect', stopRecording);
        scope.$on('$destroy', function () {
          Sockets.off('disconnect', stopRecording);
        });

        var toSend = [];

        function sendQueue (dmRecorder) {
          dmRecorder.getCurrentStateId().then(function (stateId) {
            lastId = stateId;
          });
          latencyMeasurement.sendStart();
          var id = dmRecorder.startSyncingAndGetId(toSend);
          // TODO [ToDr] Gather data from other plugins?
          Sockets.emit('state.patch', {
            _id: id,
            // TODO [ToDr] Do we always should send workspaceId?
            workspaceId: dmRecorder.getWorkspaceId(),
            patches: toSend
          }, function (isOk, stateId, lastPatch) {
            if (!isOk) {
              toSend = [{
                timestamp: new Date().getTime(),
                current: scope.slide
              }];
              sendQueue(dmRecorder);
              return;
            }

            dmRecorder.stopSyncingAndSetId(stateId, lastPatch);
            latencyMeasurement.sendStop();

            // Send queue one more time - new patches are waiting
            if (toSend.length) {
              sendQueueLater(dmRecorder);
            }
          });

          // Clear queue
          toSend = [];
        }

        var sendQueueLater = _.throttle(sendQueue, 300, {
          leading: false,
          trailing: true
        });

        // TODO [ToDr] Object.observe might be better?
        scope.$watch('slide', function (a) {
          if (a === undefined) {
            return;
          }
          var dmRecorder = scope.recorder;
          if (!dmRecorder) {
            return;
          }

          if (dmRecorder.isChangeFromRecording) {
            return;
          }

          var patch = dmRecorder.updateState(scope.slide);
          if (!patch) {
            return;
          }

          latencyMeasurement.addingPatch();
          toSend.push(patch);

          if (dmRecorder.isSyncing()) {
            return;
          }

          sendQueueLater(dmRecorder);
        }, true);
      }
    };
  });
});
