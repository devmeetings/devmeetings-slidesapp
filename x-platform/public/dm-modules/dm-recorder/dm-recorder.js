define(
  ['require', '_', 'angular', './dm-player', './dm-recorder-worker', './dm-recorder-listenable', './dm-recorder-context'],
  function (require, _, angular, player, Worker, newListenable, dmRecorderContext) {
    'use strict';

    var rec = angular.module('dm-recorder', []);
    rec.directive('dmRecorderContext', dmRecorderContext.default);
    rec.factory('dmPlayer', player);
    rec.factory('dmRecorder', function ($q) {
      return function (workspaceId) {
        var worker = new Worker.Recorder();

        var self = _.extend(newListenable.default(), {
          updateState: function (slide) {
            return worker.newState(slide);
          },

          getCurrentStateId: function () {
            if (worker.syncing) {
              return worker.idDefer.promise;
            }
            if (!worker.getId()) {
              return $q.reject(null);
            }
            return $q.when(worker.getId() + '_' + worker.getLastPatch());
          },

          stopSyncingAndSetId: function (id, lastPatch) {
            worker.syncing = false;
            var idAndPatch = id + '_' + lastPatch;
            worker.fillInIds(idAndPatch);
            this.trigger('newId', idAndPatch);
            this.trigger('newState', id, lastPatch, worker.state.current);
            worker.idDefer.resolve(idAndPatch);
          },

          startSyncingAndGetId: function (patches) {
            worker.syncing = true;
            worker.idDefer = $q.defer();
            this.trigger('onSync', patches);
            return worker.getId();
          },

          isSyncing: function () {
            return worker.syncing;
          },

          setState: function (statesaveId, content) {
            if (!statesaveId) {
              return;
            }
            this.trigger('onSync', []);
            // Cloning workspace
            worker.setState(statesaveId, JSON.parse(JSON.stringify(content)));
            this.trigger('newId', statesaveId);
            this.trigger('newState', worker.getId(), worker.getLastPatch(), worker.state.current);
            if (worker.idDefer) {
              worker.idDefer.resolve(statesaveId);
            }
          },

          getWorkspaceId: function () {
            return workspaceId;
          },

          clear: function () {
            worker.clear();
          }

        });

        self.trigger('newWorkspace', workspaceId);
        return self;
      };
    });
  });
