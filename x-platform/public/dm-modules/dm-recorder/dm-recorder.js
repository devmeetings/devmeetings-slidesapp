define(['require', 'angular', './dm-player', 'es6!./dm-recorder-worker'], function(require, angular, player, Worker) {
  'use strict';

  var rec = angular.module('dm-recorder', []);
  rec.factory('dmPlayer', player);
  rec.factory('dmRecorder', function($q) {

    var listeners = {
      'newState': [],
      'newWorkspace': []
    };
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
        var idAndPatch = id + '_' + lastPatch;
        worker.fillInIds(idAndPatch);
        worker.idDefer.resolve(idAndPatch);
        this.trigger('newState', id, lastPatch, worker.state.current);
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

      setState: function(statesaveId, content) {
        if (!statesaveId) {
          return;
        }
        // Cloning workspace
        worker.setState(statesaveId, JSON.parse(JSON.stringify(content)));
        if (worker.idDefer) {
          worker.idDefer.resolve(statesaveId);
        }
        this.trigger('newState', worker.getId(), worker.getLastPatch(), worker.state.current);
      },

      setRecording: function(val, wsId) {
        isRecording = val;
        workspaceId = wsId;
        this.trigger('newWorkspace', wsId);
      },

      getWorkspaceId: function() {
        return workspaceId;
      },

      clear: function() {
        worker.clear();
      },

      trigger: function(evName, id) {
        var list = listeners[evName];
        list.map(function(cb) {
          cb(id);
        });
      },

      listen: function(evName, cb) {
        listeners[evName].push(cb);
      }
    };
  });

});
