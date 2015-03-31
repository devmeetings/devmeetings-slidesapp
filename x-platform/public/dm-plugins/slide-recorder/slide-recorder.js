define(['module', '_', 'slider/slider.plugins'], function(module, _, sliderPlugins) {
  'use strict';

  var path = sliderPlugins.extractPath(module);

  sliderPlugins.registerPlugin('slide', '*', 'slide-recorder', 4000).directive('slideRecorder', function(Sockets, dmRecorder) {

    return {
      restrict: 'E',
      scope: {
        slide: '=context'
      },
      link: function(scope) {

        var toSend = [];

        function sendQueue(workspaceId) {
          console.debug('In queue: ', toSend.length);

          console.time('Server sync');

          var id = dmRecorder.startSyncingAndGetId();
          // TODO [ToDr] Gather data from other plugins?
          Sockets.emit('state.patch', {
            _id: id,
            // TODO [ToDr] Do we always should send workspaceId?
            workspaceId: workspaceId,
            patches: toSend
          }, function(stateId, lastPatch) {
            console.timeEnd('Server sync');

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

          var patch = dmRecorder.updateState(scope.slide);
          toSend.push(patch);

          if (dmRecorder.isSyncing()) {
            return;
          }

          sendQueueLater(scope.slide._id);
        }, true);

      }
    };
  });

});
