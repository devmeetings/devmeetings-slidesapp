define(['require', 'angular', 'es6!./dm-recorder-worker'], function(require, angular, Worker) {
  'use strict';

  var rec = angular.module('dm-recorder', []);

  rec.factory('dmRecorder', function($q) {

    var worker = new Worker.Recorder();
    var isRecording = false;
    var workspaceId = null;

    return {
      updateState: function(slide) {
        return worker.newState(slide);
      },

      getCurrentStateId: function() {
        if (worker.syncing) {
          return worker.idDefer.promise;
        }
        if (!worker.getId()) {
          return $q.reject(null);
        }
        return $q.when(worker.getId() + '_' + worker.getLastPatch());
      },

      stopSyncingAndSetId: function(id, lastPatch) {
        worker.syncing = false;
        worker.setId(id);
        worker.setLastPatch(lastPatch);
        worker.idDefer.resolve(id + '_' + lastPatch);
      },

      startSyncingAndGetId: function() {
        worker.syncing = true;
        worker.idDefer = $q.defer();
        return worker.getId();
      },

      isSyncing: function() {
        return worker.syncing;
      },

      isRecording: function() {
        return isRecording;
      },

      setRecording: function(val, wsId) {
        isRecording = val;
        workspaceId = wsId;
      },

      getWorkspaceId: function() {
        return workspaceId;
      }
    };
  });

  rec.factory('dmPlayer', function($q, dmRecorder) {

    var source = dmRecorder;

    return {

      setRecorderSource: function(workspaceId) {
        this.setSource(dmRecorder);
        dmRecorder.setRecording(true, workspaceId);
      },

      createPlayerSource: function(slide) {
        dmRecorder.setRecording(false);
        var worker = new Worker.Player();
        worker.setState(slide);

        var player = {
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

  });
});
