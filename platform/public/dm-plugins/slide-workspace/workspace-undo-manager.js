define(['_'], function(_) {
    'use strict';

    var WorkspaceUndoManager = function(scope, tabs) {
            if (!scope.workspace) {
                throw new Error('Workspace should be defined on scope object for WorkspaceUndoManager');
            }

            this.scope = scope;
            this.tabsStack = {};
            this.tabsSwitched = true;
            this.reset();
        },
        enableLogging = false;

    (function() {
        this.setUpTabsSwitched = function(val) {
            this.tabsSwitched = val;
        };
        this.getCurrentTabsStack = function() {
            return this.tabsStack[this.scope.workspace.active];
        };
        this.mergeUndoStack = function(merge, deltas, currentStack) {
            if (merge && this.hasUndo()) {
                currentStack.dirtyCounter--;
                deltas = currentStack.$undoStack.pop().concat(deltas);
            }

            return deltas;
        };
        this.setUpStack = function(options) {
            var deltas = options.args[0],
                currentStack = this.getCurrentTabsStack();

            this.$doc = options.args[1];

            deltas = this.mergeUndoStack(options.merge, deltas, currentStack);
            currentStack.$undoStack.push(deltas);
            currentStack.$redoStack = [];

            if (currentStack.dirtyCounter < 0) {
                currentStack.dirtyCounter = NaN;
            }
            currentStack.dirtyCounter++;
        };

        this.execute = function(options) { 
            //Execute method should not call main logic for setup up undo stack when
            // tabs are switched or when the first tab is initialized
            if (this.tabsSwitched) {
                this.tabsSwitched = false;
                return;
            }

            this.setUpStack(options);

        };
        this.undo = function(dontSelect) {
            var currentStack = this.getCurrentTabsStack();

            return this.makeStackAction(currentStack.$undoStack, function(deltas) {
                var range = this.$doc.undoChanges(deltas, dontSelect);
                currentStack.$redoStack.push(deltas);
                currentStack.dirtyCounter--;
                return range;
            }.bind(this));
        };
        this.redo = function(dontSelect) {
            var currentStack = this.getCurrentTabsStack();

            return this.makeStackAction(currentStack.$redoStack, function(deltas) {
                var range = this.$doc.redoChanges(deltas, dontSelect);
                currentStack.$undoStack.push(deltas);
                currentStack.dirtyCounter++;
                return range;
            }.bind(this));
        };
        this.makeStackAction = function(stack, action) {
            if (this.isEmpty(stack)) {
                return;
            }
            var deltas = stack.pop();
            if (!deltas) {
                return null;
            }
            return action(deltas);
        };
        this.isEmpty = function(stack) {
            return stack.length === 0;
        };
        this.reset = function() {
            Object.keys(this.scope.workspace.tabs).map(this.initTab, this);
        };
        this.initTab = function (tabName) {
            this.tabsStack[tabName] = {
                $undoStack: [],
                $redoStack: [],
                dirtyCounter: 0
            };
        };
        this.hasUndo = function() {
            return this.getCurrentTabsStack().$undoStack.length > 0;
        };
        this.hasRedo = function() {
            return this.getCurrentTabsStack().$redoStack.length > 0;
        };
        this.markClean = function() {
            this.getCurrentTabsStack().dirtyCounter = 0;
        };
        this.isClean = function() {
            return this.getCurrentTabsStack().dirtyCounter === 0;
        };

    }).call(WorkspaceUndoManager.prototype);

    if (enableLogging) {
        _.each(WorkspaceUndoManager.prototype, function(func, key) {
            WorkspaceUndoManager.prototype[key] = function( /*args*/ ) {
                console.log("Invoking function " + key, arguments);
                return func.apply(this, arguments);
            };
        });
    }

    return WorkspaceUndoManager;
});