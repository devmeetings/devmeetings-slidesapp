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

        function sendQueue() {
          console.debug('In queue: ', toSend.length);
          
          console.time('Server sync');
          
          var id = dmRecorder.startSyncingAndGetId();
          // TODO [ToDr] Gather data from other plugins?
          Sockets.emit('state.patch', {
            _id: id,
            patches: toSend
          }, function(stateId) {
            console.timeEnd('Server sync');

            // TODO [ToDr] Should recorder know that server received the event?
            dmRecorder.stopSyncingAndSetId(stateId);
            // TODO [ToDr] Publish results to other plugins?
            
            // Send queue one more time - new patches are waiting
            if (toSend.length) {
              sendQueue();
            }
          });

          // Clear queue
          toSend = [];
        }

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

          sendQueue();
        }, true);

      }
    };
  });

});
