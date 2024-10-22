/* globals define */
define(['_'], function (_) {
  'use strict';

  var WorkspaceUndoManager = function (scope, tabs) {
    if (!scope.workspace) {
      throw new Error('Workspace should be defined on scope object for WorkspaceUndoManager');
    }

    this.scope = scope;
    this.tabsStack = {};
    this.tabsSwitched = true;
    this.reset();
  };
  var enableLogging = false;
  var undoStackLimit = 50;

  function pushToUndoStack ($undoStack, deltas) {
    $undoStack.push(deltas);
    if ($undoStack.length > undoStackLimit) {
      $undoStack.shift();
    }
  }

  (function () {
    this.setUpTabsSwitched = function (val) {
      this.tabsSwitched = val;
    };
    this.getCurrentTabsStack = function () {
      return this.tabsStack[this.scope.workspace.active];
    };
    this.mergeUndoStack = function (merge, deltas, currentStack) {
      if (merge && this.hasUndo()) {
        currentStack.dirtyCounter--;
        deltas = currentStack.$undoStack.pop().concat(deltas);
      }

      return deltas;
    };
    this.setUpStack = function (options) {
      var deltas = options.args[0];
      var currentStack = this.getCurrentTabsStack();
      if (!currentStack) {
        return;
      }

      this.$doc = options.args[1];

      deltas = this.mergeUndoStack(options.merge, deltas, currentStack);
      pushToUndoStack(currentStack.$undoStack, deltas);
      currentStack.$redoStack = [];

      if (currentStack.dirtyCounter < 0) {
        currentStack.dirtyCounter = NaN;
      }
      currentStack.dirtyCounter++;
    };

    this.execute = function (options) {
      // Execute method should not call main logic for setup up undo stack when
      // tabs are switched or when the first tab is initialized
      if (this.tabsSwitched) {
        this.tabsSwitched = false;
        return;
      }

      this.setUpStack(options);
    };
    this.undo = function (dontSelect) {
      var currentStack = this.getCurrentTabsStack();
      if (!currentStack) {
        return;
      }

      return this.makeStackAction(currentStack.$undoStack, function (deltas) {
        var range = this.$doc.undoChanges(deltas, dontSelect);
        currentStack.$redoStack.push(deltas);
        currentStack.dirtyCounter--;
        return range;
      }.bind(this));
    };
    this.redo = function (dontSelect) {
      var currentStack = this.getCurrentTabsStack();
      if (!currentStack) {
        return;
      }

      return this.makeStackAction(currentStack.$redoStack, function (deltas) {
        var range = this.$doc.redoChanges(deltas, dontSelect);
        pushToUndoStack(currentStack.$undoStack, deltas);
        currentStack.dirtyCounter++;
        return range;
      }.bind(this));
    };
    this.makeStackAction = function (stack, action) {
      if (this.isEmpty(stack)) {
        return;
      }
      var deltas = stack.pop();
      if (!deltas) {
        return null;
      }
      return action(deltas);
    };
    this.isEmpty = function (stack) {
      return stack.length === 0;
    };
    this.reset = function () {
      Object.keys(this.scope.workspace.tabs).map(this.initTab, this);
    };
    this.removeTab = function (tabName) {
      delete this.tabsStack[tabName];
    };
    this.initTab = function (tabName) {
      this.tabsStack[tabName] = {
        $undoStack: [],
        $redoStack: [],
        dirtyCounter: 0
      };
    };
    this.hasUndo = function () {
      var stack = this.getCurrentTabsStack();
      return stack ? stack.$undoStack.length > 0 : false;
    };
    this.hasRedo = function () {
      var stack = this.getCurrentTabsStack();
      return stack ? stack.$redoStack.length > 0 : false;
    };
    this.markClean = function () {
      var stack = this.getCurrentTabsStack();
      if (!stack) {
        return;
      }
      stack.dirtyCounter = 0;
    };
    this.isClean = function () {
      var stack = this.getCurrentTabsStack();
      if (!stack) {
        return true;
      }
      return stack.dirtyCounter === 0;
    };
  }.call(WorkspaceUndoManager.prototype));

  if (enableLogging) {
    _.each(WorkspaceUndoManager.prototype, function (func, key) {
      WorkspaceUndoManager.prototype[key] = function () /* args */ {
        console.log('Invoking function ' + key, arguments);
        return func.apply(this, arguments);
      };
    });
  }

  return WorkspaceUndoManager;
});
