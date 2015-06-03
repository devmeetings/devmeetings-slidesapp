define(['require', '_', './dm-recorder-worker', './dm-recorder-listenable'], function(require, _, Worker, newListenable) {
  'use strict';

  return function($q) {

    var source = null;

    return _.extend(newListenable(), {

      setRecorderSource: function(dmRecorder, statesaveId, content) {
        this.setSource(dmRecorder);
        dmRecorder.clear();
        dmRecorder.setState(statesaveId, content);
      },

      createPlayerSource: function(dmRecorder, statesaveId, slide) {
        var dmPlayerThat = this;
        var worker = new Worker.Player();

        var player = _.extend(newListenable(), {
          setState: function(statesaveId, slide) {
            this.trigger('onSync', []);
            worker.setState(statesaveId, slide);
            this.trigger('newId', statesaveId);
          },

          getCurrentState: function() {
            return worker.state.current;
          },

          applyPatchesAndId: function(patchId) {
            this.trigger('onSync', worker.getPatches(patchId));
            var x = worker.applyPatchesAndId(patchId);
            this.trigger('newId', this._currentStateId());
            return x;
          },

          applyReversePatchesAndId: function(patchesAndId) {
            this.trigger('onSync', worker.getPatches(patchesAndId));
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

          setPlayerPaused: function(isPaused) {
            if (!isPaused) {
              return this._resumePlayer();
            }
            if (!dmRecorder) {
              return;
            }

            var content = this.getCurrentState();
            var id = this._currentStateId();
            this.updatePreviousContent();
            dmPlayerThat.setRecorderSource(dmRecorder, id, content);
          },

          // Invoked when the player is paused and we are jumping to different second
          updatePreviousContent: function() {
            dmPlayerThat.previousContent = JSON.stringify(this.getCurrentState());
          },
          restorePreviousContent: function() {
            if (!dmPlayerThat.previousContent) {
              return;
            }
            worker.applyCurrentState(JSON.parse(dmPlayerThat.previousContent));
          },

          _resumePlayer: function() {
            if (!dmRecorder) {
              return;
            }
            // Resume state?
            dmPlayerThat.setSource(player);
            if (dmPlayerThat.previousContent) {
              this.restorePreviousContent();
              dmPlayerThat.previousContent = null;
            }
          }
        });

        player.setState(statesaveId, slide);
        dmPlayerThat.setSource(player);
        return player;
      },

      setSource: function(s) {
        this._removeListeners(source);
        source = s;
        this._attachListeners(source);
      },

      _removeListeners: function(source) {
        if (!source || !source.__removeListeners) {
          return;
        }
        source.__removeListeners();
      },

      _attachListeners: function(source) {
        var off = source.listen('newId', this.trigger.bind(this, 'newId'));
        var off2 = source.listen('onSync', this.trigger.bind(this, 'onSync'));
        source.__removeListeners = function() {
          off();
          off2();
        };
      },

      getCurrentStateId: function() {
        return source.getCurrentStateId();
      },

      _cbWithSelfApply: function(scope, callback) {
        return function(x) {
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
      },

      onSyncStarted: function(scope, callback) {
        var cb = this._cbWithSelfApply(scope, callback);
        var off = this.listen('onSync', cb);
        scope.$on('$destroy', off);
      },

      onCurrentStateId: function(scope, callback) {
        var cb = this._cbWithSelfApply(scope, callback);
        var off = this.listen('newId', cb);
        scope.$on('$destroy', off);

        // Invoke callback
        this.getCurrentStateId().then(callback);
      }

    });
  };
});
