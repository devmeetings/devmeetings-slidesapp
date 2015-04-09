define(['require', 'es6!./dm-recorder-worker'], function(require, Worker) {
  'use strict';

  return function($q, dmRecorder) {

    var source = dmRecorder;

    return {

      setRecorderSource: function(workspaceId, statesaveId, content) {
        this.setSource(dmRecorder);
        dmRecorder.setRecording(true, workspaceId);
        dmRecorder.clear();
        dmRecorder.setState(statesaveId, content);
      },

      createPlayerSource: function(statesaveId, slide) {
        dmRecorder.setRecording(false);
        var worker = new Worker.Player();

        var player = {
          setState: function(statesaveId, slide) {
            worker.setState(statesaveId, slide);
          },

          getCurrentState: function() {
            return worker.state.current;
          },

          applyPatchesAndId: function(patchId) {
            return worker.applyPatchesAndId(patchId);
          },

          getCurrentStateId: function() {
            if (!worker.getId()) {
              return $q.reject(null);
            }
            return $q.when(worker.getId() + '_' + worker.getLastPatch());
          }
        };

        player.setState(statesaveId, slide);
        this.setSource(player);
        return player;
      },

      setSource: function(s) {
        source = s;
      },

      getCurrentStateId: function() {
        return source.getCurrentStateId();
      }

    };
  };
});
