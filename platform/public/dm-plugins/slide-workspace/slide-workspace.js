define(['module', '_', 'slider/slider.plugins', 'ace', './slide-workspace-output'], function(module, _, sliderPlugins, ace) {
    'use strict';

    var EDITOR_THEME = 'todr';
    var path = sliderPlugins.extractPath(module);



    var applyChangesLater = _.debounce(function(scope) {
        scope.$apply();
    }, 500);

    var triggerChangeLater = _.throttle(function(scope) {
        sliderPlugins.trigger('slide.slide-workspace.change', scope.workspace);
        triggerSave();
    }, 200, {
        leading: false,
        trailing: true
    });

    var triggerSave = _.throttle(function() {
        sliderPlugins.trigger('slide.save');
    }, 20);

    sliderPlugins.filter('objectKeys', function() {
        return function(object) {
            return Object.keys(object);
        };
    });


    sliderPlugins.registerPlugin('slide', 'workspace', 'slide-workspace', 3900).directive('slideWorkspace', [
        '$timeout', '$window', '$rootScope',
        function($timeout, $window, $rootScope) {
            return {
                restrict: 'E',
                scope: {
                    workspace: '=data',
                    slide: '=context',
                    mode: '='
                },
                templateUrl: path + '/slide-workspace.html',
                link: function(scope, element) {
                    scope.output = {
                        show: false,
                        sideBySide: true
                    };


                    // This is temporary hack!
                    function promptForName(old) {
                        var name = $window.prompt("Insert new filename", old ? old.replace(/\|/g, '.') : undefined);
                        if (!name) {
                            return;
                        }
                        return name.replace(/\./g, '|');
                    }

                    function deleteTabAndFixActive(tabName, newName) {
                        var ws = scope.workspace;
                        delete ws.tabs[tabName];
                        if (ws.active === tabName) {
                            ws.active = newName || Object.keys(ws.tabs)[0];
                        }
                    }

                    scope.insertTab = function() {
                        var name = promptForName();
                        if (!name) {
                            return;
                        }
                        scope.workspace.tabs[name] = {
                            "content": ""
                        };
                    };
                    scope.removeTab = function(tabName) {
                        var sure = $window.confirm("Sure to remove the file?");
                        if (!sure) {
                            return;
                        }
                        deleteTabAndFixActive(tabName);
                    };
                    scope.editTabName = function(tabName) {
                        var newName = promptForName(tabName);
                        if (!newName) {
                            return;
                        }
                        var ws = scope.workspace;
                        ws.tabs[newName] = ws.tabs[tabName];
                        deleteTabAndFixActive(tabName, newName);
                    };

                    scope.tabsOrdering = function(tab) {
                        return getExtension(tab);
                    };

                    // Editor
                    /* 
                     * [ToDr] Not sure why we need to introduce timeout here,
                     * But when there is no timeout syntax highlighting doesnt work after loading editor
                     * for the second time.
                     */

                    var $e = element.find('.editor');
                    $timeout(function() {
                        var editor = ace.edit($e[0]);
                        editor.setTheme('ace/theme/' + EDITOR_THEME);
                        editor.setValue("");
                        editor.getSession().setTabSize(2);
                        editor.getSession().setUseSoftTabs(true);
                        editor.getSession().setUseWrapMode(!!scope.workspace.wrap);
                        editor.setOptions({
                            enableBasicAutocompletion: true,
                            enableSnippets: true,
                            enableLiveAutocompletion: false
                        });

                        scope.$watch('output.sideBySide', function() {
                            scope.output.show = false;
                            // Refresh view
                            triggerChangeLater(scope);
                            editor.resize();
                        });

                        ///

                        // TODO [ToDr] When changing tabs cursor synchronization is triggered like crazy.
                        var disableSync = false;

                        function withoutSync(call) {
                            disableSync = true;
                            call();
                            disableSync = false;
                        }

                        function refreshActiveTab() {
                            var ws = scope.workspace;
                            scope.activeTab = ws.tabs[ws.active];
                        }

                        editor.on('change', function() {
                            if (disableSync) {
                                return;
                            }
                            syncEditorContent(editor, scope.activeTab);
                            triggerSave();
                            applyChangesLater(scope);
                        });

                        editor.getSession().getSelection().on('changeCursor', function() {
                            if (disableSync) {
                                return;
                            }
                            scope.activeTab.editor = scope.activeTab.editor || {};
                            syncEditorOptions(editor, scope.activeTab.editor);
                            triggerSave();
                            applyChangesLater(scope);
                        });

                        // Active tab
                        scope.$watch('activeTab.mode', function(mode) {
                            if (!mode) {
                                return;
                            }
                            updateMode(editor, scope.workspace.active, mode);
                        });

                        scope.$watch('activeTab.content', function(content) {
                            if (!content) {
                                return;
                            }

                            if (scope.mode === 'player') {
                                withoutSync(function() {
                                    updateEditorContent(editor, scope.activeTab);
                                });
                            }
                            triggerChangeLater(scope);
                        });

                        scope.$watch('activeTab.editor', function() {
                            if (scope.mode !== 'player') {
                                return;
                            }

                            withoutSync(function() {
                                updateEditorOptions(editor, scope.activeTab);
                            });
                        });

                        scope.$watch('activeTab', function(){
                            if (!scope.activeTab) {
                                return;
                            }
                            withoutSync(function(){
                                updateEditorContent(editor, scope.activeTab);
                                updateEditorOptions(editor, scope.activeTab);
                            });
                        });

                        scope.$watch('workspace', refreshActiveTab);

                        scope.$on('slide:update', function(){
                            refreshActiveTab();
                        });

                        // Tab switch
                        scope.$watch('workspace.active', function() {
                            withoutSync(function() {
                                var ws = scope.workspace;
                                var active = ws.active;
                                scope.activeTab = ws.tabs ? ws.tabs[active] : null;
                                if (!scope.activeTab) {
                                    return;
                                }

                                var tab = scope.activeTab;
                                updateMode(editor, active, tab.mode);
                                updateEditorContent(editor, tab, true);
                                triggerSave();
                            });
                        });

                        handleErrorListeners(scope, $window);

                        editor.resize();
                    }, 200);
                }
            };
        }
    ]);

    function syncEditorContent(editor, tab) {
        tab.content = editor.getValue();
    }

    function syncEditorOptions(editor, options) {
        options.cursorPosition = editor.getCursorPosition();
        options.selectionRange = JSON.parse(JSON.stringify(editor.getSelectionRange()));
        options.firstVisibleRow = editor.getFirstVisibleRow();
        options.lastVisibleRow = editor.getLastVisibleRow();
    }

    function updateEditorContent(editor, tab, forceUpdateCursor) {
        // Remember cursor
        var pos = editor.getSelectionRange();
        editor.setValue(tab.content, -1);
        // Restore cursor
        editor.getSelection().setSelectionRange(pos, false);
        // Handle scrolling
        updateEditorOptions(editor, tab, forceUpdateCursor);
    }

    function updateEditorSelection(editor, tab, forceUpdateCursor) {
        var lastRow = editor.getLastVisibleRow();
        var selection = editor.getSelection();
        var range = tab.editor.selectionRange;
        // TODO [ToDr] Trying to remove strange flickering
        if (forceUpdateCursor || range.start.row < lastRow) {
            selection.setSelectionRange(range, false);
        }
    }

    function updateEditorScroll(editor, tab) {
        var firstRow = tab.editor.firstVisibleRow;
        // Now check if our selection is still visilbe
        var selectionRow = tab.editor.selectionRange.start.row;
        // Get rows diff
        var originalViewportSize = tab.editor.lastVisibleRow - firstRow;
        var currentViewportSize = editor.getLastVisibleRow() - editor.getFirstVisibleRow();
        // Scale viewport
        var scaledRowDiff = (selectionRow - firstRow) * currentViewportSize / originalViewportSize;
        // Make sure that selection is at most few lines from the bottom
        scaledRowDiff = Math.min(scaledRowDiff, currentViewportSize - 3);

        // Now it should be ok
        editor.scrollToLine(Math.floor(selectionRow - scaledRowDiff), false, true);
    }

    function updateEditorOptions(ed, tab, forceUpdateCursor) {
        if (!tab || !tab.editor) {
            return;
        }
        updateEditorSelection(ed, tab, forceUpdateCursor);
        updateEditorScroll(ed, tab);
    }

    function getExtension(name) {
        return name.split('|')[1];
    }

    function updateMode(editor, name, givenMode) {
        var modesMap = {
            'js': 'javascript'
        };

        var mode;
        if (givenMode) {
            mode = givenMode;
        } else {
            mode = getExtension(name) || "text";
            mode = modesMap[mode] || mode;
        }
        editor.getSession().setMode("ace/mode/" + mode);
    }

    function handleErrorListeners(scope, $window) {
        // Errors forwarder
        var listener = function(ev) {
            var d = ev.data;
            if (d.type !== 'fiddle-error') {
                return;
            }
            scope.$apply(function() {
                scope.errors = d.msg;
            });
        };

        $window.addEventListener('message', listener);
        scope.$on('$destroy', function() {
            $window.removeEventListener('message', listener);
        });
    }

});
