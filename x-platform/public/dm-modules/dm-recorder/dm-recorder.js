define(['require', 'angular', 'es6!./dm-recorder-worker'], function(require, angular, Worker) {
  'use strict';

  angular.module('dm-recorder', []).factory('dmRecorder', function($q) {

    var worker = new Worker();

    return {
      updateState: function(slide) {
        return worker.newState(slide);
      },
      getCurrentStateId: function() {
        if (worker.syncing) {
          return worker.idDefer.promise;
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
      }
    };

  });
});
