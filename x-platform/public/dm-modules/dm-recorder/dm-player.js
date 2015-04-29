define(['require', '_', 'es6!./dm-recorder-worker', 'es6!./dm-recorder-listenable'], function(require, _, Worker, newListenable) {
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

        var player = _.extend(newListenable(), {
          setState: function(statesaveId, slide) {
            worker.setState(statesaveId, slide);
            this.trigger('newId', statesaveId);
          },

          getCurrentState: function() {
            return worker.state.current;
          },

          applyPatchesAndId: function(patchId) {
            var x = worker.applyPatchesAndId(patchId);
            this.trigger('newId', this._currentStateId());
            return x;
          },

          applyReversePatchesAndId: function(patchesAndId) {
            var x = worker.applyReversePatchesAndId(patchesAndId);
            this.trigger('newId', this._currentStateId());
            return x;
          },

          _currentStateId: function() {
            return worker.getId() + '_' + worker.getLastPatch();
          },

          getCurrentStateId: function() {
            if (!worker.getId()) {
              return $q.reject(null);
            }
            return $q.when(this._currentStateId());
          },
        });

        player.setState(statesaveId, slide);
        this.setSource(player);
        return player;
      },

      setSource: function(s) {
        source = s;
      },

      // TODO [ToDr] Consider using onCurrentStateId!
      getCurrentStateId: function() {
        return source.getCurrentStateId();
      },

      onCurrentStateId: function(scope, callback) {
        var cb = function(x) {
          // TODO [ToDr] SafeApply?
          function safeApply(scope, fn) {
            var phase = scope.$root.$$phase;
            if (phase === '$apply' || phase === '$digest') {
              if (fn && (typeof(fn) === 'function')) {
                fn();
              }
            } else {
              scope.$apply(fn);
            }
          }

          safeApply(scope, callback.bind(scope, x));
        };
        var off = source.listen('newId', cb);
        scope.$on('$destroy', off);
        // Invoke callback
        this.getCurrentStateId().then(callback);
      }

    };
  };
});
