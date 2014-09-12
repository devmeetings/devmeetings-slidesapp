define(['module', '_', 'slider/slider.plugins', 'ace', './slide-workspace-output'], function(module, _, sliderPlugins, ace) {
    'use strict';

    var EDITOR_THEME = 'todr';
    var path = sliderPlugins.extractPath(module);

    sliderPlugins.registerPlugin('slide', 'workspace', 'slide-workspace', 3900).directive('slideWorkspace', [
        '$timeout', '$window', '$rootScope',
        function($timeout, $window, $rootScope) {
            return {
                restrict: 'E',
                scope: {
                    workspace: '=data',
                    slide: '=context',
                    mode: '@'
                },
                templateUrl: path + '/slide-workspace.html',
                link: function(scope, element) {
                    // This is temporary hack!
                    scope.insertTab = function() {
                        var name = $window.prompt("Tab name - separate extension with |");
                        if (!name) {
                            return;
                        }
                        scope.workspace.tabs[name] = {
                            "content": ""
                        };
                    };

                    // Editor
                    var $e = element.find('.editor');
                    var editor = ace.edit($e[0]);
                    editor.setTheme('ace/theme/' + EDITOR_THEME);
                    editor.setValue("");
                    editor.getSession().setTabSize(4);
                    editor.getSession().setUseSoftTabs(true);
                    editor.getSession().setUseWrapMode(true);


                    var applyChangesLater = _.debounce(function() {
                        scope.$apply();
                    }, 500);

                    var triggerChangeLater = _.throttle(function() {
                        sliderPlugins.trigger('slide.slide-workspace.change', scope.workspace);
                        triggerSave();
                    }, 700, {
                        leading: false,
                        trailing: true
                    });

                    var triggerSave = _.throttle(function() {
                        sliderPlugins.trigger('slide.save');
                    }, 20);

                    ///

                    editor.on('change', function() {
                        syncEditorContent(editor, scope.activeTab);
                        triggerSave();
                        applyChangesLater();
                    });

                    editor.getSession().getSelection().on('changeCursor', function() {
                        scope.activeTab.editor = scope.activeTab.editor || {};
                        syncEditorOptions(editor, scope.activeTab.editor);
                        triggerSave();

                        applyChangesLater();
                        //sliderPlugins.trigger('slide.selection-share', 'mouse!');
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
                            updateEditorContent(editor, scope.activeTab);
                        }
                        triggerChangeLater();
                    });

                    if (scope.mode === 'player') {
                        scope.$watch('activeTab.editor', function() {
                            updateEditorOptions(editor, scope.activeTab);
                        });
                        scope.$watch('workspace', function() {
                            var ws = scope.workspace;
                            scope.activeTab = ws.tabs[ws.active];
                        });
                    }

                    // Tab switch
                    var fromTogether = false;
                    scope.$watch('workspace.active', function() {
                        var ws = scope.workspace;
                        var active = ws.active;
                        scope.activeTab = ws.tabs ? ws.tabs[active] : null;
                        if (!scope.activeTab) {
                            return;
                        }
                        var tab = scope.activeTab;
                        updateMode(editor, active, tab.mode);

                        if (!fromTogether) {
                            updateEditorContent(editor, tab);
                            fromTogether = false;
                        }
                        triggerSave();
                    });


                    // Update from togetherJS
                    sliderPlugins.listen(scope, 'slide.slide-workspace.update', function(workspace) {
                        scope.activeTab = workspace.tabs[workspace.active];
                        updateEditorContent(editor, scope.activeTab);
                    });

                    scope.$on('reload.workspace', function() {
                        var ws = scope.workspace;
                        scope.activeTab = ws.tabs[ws.active];
                        updateEditorContent(editor, scope.activeTab);
                    });

                    handleErrorListeners(scope, $window);

                    $timeout(function() {
                        editor.resize();
                    }, 1000);
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

    function updateEditorContent(editor, tab) {
        // Remember cursor
        var pos = editor.getSelectionRange();
        editor.setValue(tab.content, -1);
        // Restore cursor
        editor.getSelection().setSelectionRange(pos, false);
        // Handle scrolling
        updateEditorOptions(editor, tab);
    }

    function updateEditorSelection(editor, tab) {
        var lastRow = editor.getLastVisibleRow();
        var selection = editor.getSelection();
        var range = tab.editor.selectionRange;
        // TODO [ToDr] Trying to remove strange flickering
        if (range.start.row < lastRow) {
            selection.setSelectionRange(range, false);
        }
    }

    function updateEditorScroll(editor, tab) {
        var newBottomRow = tab.editor.lastVisibleRow;
        editor.scrollToRow(newBottomRow);
        return newBottomRow;
    }

    function updateEditorOptions(ed, tab) {
        if (!tab || !tab.editor) {
            return;
        }
        updateEditorSelection(ed, tab);
        updateEditorScroll(ed, tab);
    }

    function updateMode(editor, name, givenMode) {
        var modesMap = {
            'js': 'javascript'
        };

        var mode;
        if (givenMode) {
            mode = givenMode;
        } else {
            mode = name.split('|')[1] || "text";
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
