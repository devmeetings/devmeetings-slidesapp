define(['module', '_', 'slider/slider.plugins'], function(module, _, sliderPlugins) {
  'use strict';

  sliderPlugins.registerPlugin('slide', '*', 'slide-recorder', 4000).directive('slideRecorder', function(Sockets, dmRecorder) {

    var lastId;

    Sockets.on('disconnect', function() {
      if (!lastId) {
        return;
      }
      var id = lastId.split('_');
      dmRecorder.stopSyncingAndSetId(id[0], id[1]);
    });

    return {
      restrict: 'E',
      scope: {
        slide: '=context',
        mode: '=',
        path: '@'
      },
      link: function(scope) {
        // Disable recorder on some sub slides.
        if (scope.path !== '.*') {
          return;
        }

        var toSend = [];
        var lastLog = new Date().getTime();

        function sendQueue() {
          var shouldLog = (new Date()).getTime() - lastLog > 30 * 1000;
          if (shouldLog) {
            lastLog = new Date().getTime();
            console.debug('In queue: ', toSend.length);
            console.time('Server sync');
          }

          lastId = dmRecorder.startSyncingAndGetId();
          // TODO [ToDr] Gather data from other plugins?
          Sockets.emit('state.patch', {
            _id: lastId,
            // TODO [ToDr] Do we always should send workspaceId?
            workspaceId: dmRecorder.getWorkspaceId(),
            patches: toSend
          }, function(isOk, stateId, lastPatch) {
            if (shouldLog) {
              console.timeEnd('Server sync');
            }

            if (!isOk) {
              toSend = [{
                timestamp: new Date().getTime(),
                current: scope.slide
              }];
              sendQueue();
              return;
            }

            // TODO [ToDr] Should recorder know that server received the event?
            dmRecorder.stopSyncingAndSetId(stateId, lastPatch);
            // TODO [ToDr] Publish results to other plugins?

            // Send queue one more time - new patches are waiting
            if (toSend.length) {
              sendQueueLater();
            }
          });

          // Clear queue
          toSend = [];
        }

        var sendQueueLater = _.throttle(sendQueue, 300);

        // TODO [ToDr] Object.observe might be better?
        scope.$watch('slide', function(a) {
          if (a === undefined) {
            return;
          }

          if (!dmRecorder.isRecording()) {
            return;
          }

          var patch = dmRecorder.updateState(scope.slide);
          if (!patch) {
            return;
          }

          toSend.push(patch);

          if (dmRecorder.isSyncing()) {
            return;
          }

          sendQueueLater();
        }, true);

      }
    };
  });

});
