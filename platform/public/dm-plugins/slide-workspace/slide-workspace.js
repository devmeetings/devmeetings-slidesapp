define(['module', '_', 'slider/slider.plugins', 'ace', 'js-beautify', './workspace-undo-manager',
        'share', 'sharejs-ace', 'sharejs-json'],
    function (module, _, sliderPlugins, ace, jsBeautify, WorkspaceUndoManager) {
        'use strict';

        var EDITOR_THEME = 'todr';
        var path = sliderPlugins.extractPath(module);
        var $state, $stateMap = {}, readOnly = false, markers = {}, $e;


        var applyChangesLater = _.debounce(function (scope) {
            scope.$apply();
        }, 500);

        var triggerChangeLater = _.throttle(function (scope) {
            sliderPlugins.trigger('slide.slide-workspace.change', scope.workspace);
            triggerSave();
        }, 500, {
            leading: false,
            trailing: true
        });

        var triggerSave = _.throttle(function () {
            sliderPlugins.trigger('slide.save');
        }, 20);

        sliderPlugins.filter('objectKeys', function () {
            return function (object) {
                return Object.keys(object);
            };
        });

        sliderPlugins.registerPlugin('slide', 'workspace', 'slide-workspace', 3900).directive('slideWorkspace', [
            '$timeout', '$window', '$rootScope', 'dmUser',
            function ($timeout, $window, $rootScope, dmUser) {
                return {
                    restrict: 'E',
                    scope: {
                        workspace: '=data',
                        slide: '=context',
                        mode: '='
                    },
                    templateUrl: path + '/slide-workspace.html',
                    controller: ["$scope", "$upload",
                        function ($scope, $upload) {
                            $scope.onFileSelect = function ($files) {
                                if (!confirm("Uploading file will erase your current workspace. Continue?")) {
                                    return;
                                }
                                //$files: an array of files selected, each file has name, size, and type.
                                $scope.isUploading = true;
                                $scope.uploadingState = 0;
                                $files.forEach(function (file) {
                                    $scope.upload = $upload.upload({
                                        url: '/api/upload',
                                        file: file
                                    }).progress(function (evt) {
                                        $scope.uploadingState = parseInt(100.0 * evt.loaded / evt.total);
                                    }).success(function (data, status, headers, config) {
                                        $scope.isUploading = false;
                                        // override workspace
                                        var ws = $scope.workspace;
                                        ws.active = null;
                                        ws.tabs = {};
                                        _.each(data, function (value, name) {
                                            ws.active = name;
                                            ws.tabs[name] = {
                                                content: value
                                            };
                                        });
                                        refreshActiveTab($scope);
                                        triggerSave();
                                        applyChangesLater($scope);
                                    });
                                });
                            };
                        }
                    ],
                    link: function (scope, element) {
                        var undoManager = new WorkspaceUndoManager(scope, scope.workspace.tabs);


                        scope.output = {
                            width: 6,
                            show: false,
                            sideBySide: true
                        };
                        scope.getType = getExtension;


                        scope.changeWidth = function () {
                            var out = scope.output;
                            out.width -= 2;
                            out.sideBySide = true;
                            if (out.width === 0) {
                                out.sideBySide = false;
                            }
                            if (out.width < 0) {
                                out.width = 6;
                            }
                        };


                        // This is temporary hack!
                        function promptForName (old) {
                            var name = $window.prompt("Insert new filename", old ? old.replace(/\|/g, '.') : "");
                            if (!name) {
                                return;
                            }
                            return name.replace(/\./g, '|');
                        }

                        function deleteTabAndFixActive (tabName, newName) {
                            var ws = scope.workspace;
                            delete ws.tabs[tabName];
                            if (ws.active === tabName) {
                                ws.active = newName || Object.keys(ws.tabs)[0];
                            }
                        }

                        scope.insertTab = function () {
                            if (scope.isWorkspaceReadOnly()) {
                                return;
                            }
                            var name = promptForName();
                            if (!name) {
                                return;
                            }
                            scope.workspace.tabs[name] = {
                                "content": ""
                            };
                            undoManager.initTab(name);
                        };
                        scope.removeTab = function (tabName) {
                            if (scope.isWorkspaceReadOnly()) {
                                return;
                            }
                            var sure = $window.confirm("Sure to remove the file?");
                            if (!sure) {
                                return;
                            }
                            deleteTabAndFixActive(tabName);
                        };
                        scope.editTabName = function (tabName) {
                            if (scope.isWorkspaceReadOnly()) {
                                return;
                            }
                            var newName = promptForName(tabName);
                            if (!newName) {
                                return;
                            }
                            var ws = scope.workspace;
                            ws.tabs[newName] = ws.tabs[tabName];
                            deleteTabAndFixActive(tabName, newName);
                            undoManager.initTab(newName);
                        };

                        scope.tabsOrdering = function (tab) {
                            return getExtension(tab);
                        };
                        scope.toFileName = function (tab) {
                            return tab.replace(/\|/g, '.');
                        };


                        // Editor
                        /*
                         * [ToDr] Not sure why we need to introduce timeout here,
                         * But when there is no timeout syntax highlighting doesnt work after loading editor
                         * for the second time.
                         */

                        $e = element.find('.editor');
                        $timeout(function () {

                            var indentSize = 2, isRemoteWorkspace = false, disableScrollSync = false;


                            var editor = ace.edit($e[0]);
                            editor.setTheme('ace/theme/' + EDITOR_THEME);
                            editor.setValue("");
                            editor.getSession().setTabSize(indentSize);
                            editor.getSession().setUseSoftTabs(true);
                            editor.getSession().setUseWrapMode(!!scope.workspace.wrap);
                            editor.setOptions({
                                enableBasicAutocompletion: true,
                                enableSnippets: true,
                                enableLiveAutocompletion: false
                            });

                            (function vimMode () {
                                if (scope.workspace.vim || (localStorage && localStorage.getItem('vimMode'))) {
                                    editor.setKeyboardHandler("ace/keyboard/vim");
                                }
                            }());

                            scope.$watch('output.width', function () {
                                // Because of animation we have to make timeout
                                $timeout(function () {
                                    editor.resize();
                                }, 500);
                            });

                            scope.$watch('workspace.tabs', function () {
                                undoManager.reset();
                            });

                            //---------------- BEGIN CODE SHARE ---------------------------
                            var isMentor = false, docName;

                            var availableWorkspaceModes = {
                                m: 'mentor',
                                p: 'pair',
                                get: function (key) {
                                    if (availableWorkspaceModes[key] !== undefined) {
                                        return availableWorkspaceModes[key];
                                    }
                                    return null;
                                }
                            };
                            //mode for editor
                            // mentor_session - workspace is read-only
                            // pair_session - can make changes on workspace
                            scope.mode = '';
                            scope.workspaceMode = null;
                            scope.currentWriter = {id: 0};
                            scope.startNewMentorSession = startNewMentorSession;
                            scope.startNewPairSession = startNewPairSession;

                            //scope.isStudent = function () {
                            //    if (scope.workspaceMode === null) {
                            //        return false;
                            //    }
                            //
                            //    if (scope.workspaceMode === 'mentor') {
                            //        return !isMentor;
                            //    }
                            //
                            //};

                            scope.isMentor = function () {
                                return isMentor;
                            };

                            scope.setActiveTabName = function (tab) {
                                if (scope.isWorkspaceReadOnly()) {
                                    return;
                                }

                                if ($state) {
                                    $state.shout({
                                        newTab: tab
                                    });
                                }

                                scope.workspace.active = tab;
                                scope.output.show = false;
                            };

                            //function getWorkspaceMode () {
                            //    var result = /ref=([m|p]:[^&]*)/.exec(window.location.search);
                            //
                            //
                            //    if (result !== null) {
                            //
                            //        scope.workspaceMode = availableWorkspaceModes.get(result[1].slice(0, 1));
                            //        docName = result[1];
                            //
                            //        if (scope.workspaceMode === 'mentor') {
                            //
                            //            editor.setReadOnly(true);
                            //            readOnly = true;
                            //
                            //            openShareJsDoc(docName);
                            //
                            //            if (localStorage && localStorage.getItem('role') === 'mentor') {
                            //                editor.setReadOnly(false);
                            //                readOnly = false;
                            //                isMentor = true;
                            //                localStorage.removeItem('role');
                            //            }
                            //        }
                            //        else if (scope.workspaceMode === 'pair') {
                            //            // openShareJsDoc(docName);
                            //            scope.connectedUsers = [];
                            //
                            //
                            //            dmUser.getCurrentUser().then(function (data) {
                            //                createShereJsDocsForTabs(docName, data.result);
                            //            });
                            //
                            //
                            //
                            //        }
                            //
                            //        // scope.setUpMode = true;
                            //
                            //
                            //    }
                            //}

                            function setUpWorkspace () {
                                var result = /ref=([^&]*)/.exec(window.location.search);


                                if (result !== null) {

                                    docName = result[1];
                                    scope.connectedUsers = [];


                                    dmUser.getCurrentUser().then(function (data) {
                                        scope.currentUser = data.result;
                                        createShereJsDocsForTabs(docName, data.result);
                                    });


                                }
                            }

                            function startNewMentorSession () {

                                if (localStorage) {
                                    localStorage.setItem('role', 'mentor');
                                }
                                startNewSession('m');
                            }

                            function startNewPairSession () {

                                startNewSession('p');
                            }

                            function startNewSession (prefix) {

                                if (localStorage && scope.restoreWorkspace) {
                                    localStorage.setItem('workspace', JSON.stringify(scope.workspace));
                                }

                                var docName = prefix + ":" + randomString(),
                                    url = window.location.protocol + "//" + window.location.host +
                                        window.location.pathname + "?ref=" + docName + window.location.hash;
                                // openShareJsDoc(docName);
                                window.open(url);
                                //alert('Udostępnij pozostałym uczestnikom poniższy link\n' + url);
                            }

                            function randomString () {
                                var i = '';
                                while (i.length < 5) {
                                    i = Math.random().toString(36).slice(2);
                                }
                                return i;
                            }

                            setUpWorkspace();

                            function openShareJsDocForTab (docName, tabName) {

                                sharejs.open(docName + '_' + tabName, 'text', function (error, doc) {
                                    $stateMap[tabName] = doc;


                                    doc.on('remoteop', function (op) {

                                        var ws = scope.workspace;
                                        var active = ws.active;

                                        if (active === tabName) {
                                            scope.activeTab.content = doc.snapshot;

                                            withoutSync(function () {
                                                updateEditorContent(editor, scope.activeTab);
                                            });


                                        }
                                        else {
                                            ws.tabs[tabName].content = doc.snapshot;
                                        }

                                        triggerChangeLater(scope);
                                    });

                                    doc.on('shout', function (obj) {
                                        isRemoteWorkspace = true;
                                        console.log(obj);
                                        if (obj.users) {

                                        }
                                        else if (obj.editor) {
                                            disableScrollSync = true;
                                            withoutSync(function () {
                                                updateEditorOptions(editor, obj, true);
                                            });

                                        } else if (obj.scrollTop) {
                                            disableScrollSync = true;
                                            editor.getSession().setScrollTop(obj.scrollTop);
                                        } else if (obj.scrollLeft) {
                                            disableScrollSync = true;
                                            editor.getSession().setScrollLeft(obj.scrollLeft);
                                        }

                                        applyChangesLater(scope);
                                    });

                                });
                            }

                            scope.canShowWritersList = function () {
                                return scope.isWriter || !scope.isStudent;
                            };

                            scope.isSessionMentor = function () {
                                return scope.isWriter && scope.currentWriter.id !== 0;
                            };

                            scope.isAllCanWrite = function () {
                                return scope.isWriter && scope.currentWriter.id === 0;
                            };

                            scope.isWorkspaceReadOnly = function () {
                                return scope.workspaceMode === 'readonly';
                            };

                            function setUpWorkspaceMode () {

                                if (!scope.isWriter) {
                                    scope.workspaceMode = 'readonly';
                                    editor.setReadOnly(true);
                                }
                                else if (scope.isSessionMentor()) {
                                    scope.workspaceMode = 'mentor';
                                    editor.setReadOnly(false);
                                }
                                else if (scope.isAllCanWrite()) {
                                    scope.workspaceMode = 'all';
                                    editor.setReadOnly(false);
                                }

                            }

                            scope.$watch('currentWriter', function (currentWriter) {

                                if (!currentWriter) {
                                    return;
                                }

                                scope.isWriter = currentWriter.name === scope.currentUser.name ? true :
                                currentWriter.id === 0;


                                setUpWorkspaceMode();

                                if (scope.currentWriterChangedOnRemoteChange) {
                                    scope.currentWriterChangedOnRemoteChange = false;
                                }
                                else if ($state) {
                                    $state.at('writer').set(currentWriter.name);
                                }
                            });

                            scope.currentWriterChange = function (currentWriter) {
                                scope.currentWriter = currentWriter;
                            };

                            function amIConnectedToThisSession (users) {
                                var result = false;
                                _.each(users, function (user) {
                                    if (user.id === scope.currentUser.userId) {
                                        result = true;
                                    }
                                });

                                return result;
                            }

                            function setUpConnectedList (snapshot) {
                                scope.connectedUsers = snapshot.users;
                                scope.currentWriterChangedOnRemoteChange = true;

                                _.each(snapshot.users, function (connectedUser) {
                                    if (snapshot.writer === connectedUser.name) {
                                        scope.currentWriterChange(connectedUser);
                                    }
                                });

                                applyChangesLater(scope);
                            }

                            function createShereJsDocsForTabs (docName, user) {

                                _.each(user.acl, function (role) {
                                    scope.isStudent = role === 'student';
                                });

                                sharejs.open(docName, 'json', function (error, doc) {
                                    $state = doc;

                                    doc.on('change', function (op) {
                                        setUpConnectedList($state.snapshot);
                                    });

                                    if (doc.created) {
                                        doc.at([]).set({
                                            users: [{
                                                name: 'Wszyscy',
                                                id: 0
                                            }, prepareUserData()],
                                            writer: user.name
                                        });

                                        applyChangesLater(scope);
                                    } else if (!amIConnectedToThisSession($state.snapshot.users)) {
                                        $state.at('users').push(prepareUserData());
                                    } else {
                                        setUpConnectedList($state.snapshot);
                                    }

                                    doc.on('shout', function (obj) {
                                        isRemoteWorkspace = true;
                                        if (obj.newTab) {
                                            withoutSync(function () {
                                                scope.workspace.active = obj.newTab;
                                            });
                                        } else if (obj.editor) {
                                            disableScrollSync = true;
                                            withoutSync(function () {
                                                updateEditorOptions(editor, obj, true);
                                            });

                                        } else if (obj.scrollTop) {
                                            disableScrollSync = true;
                                            editor.getSession().setScrollTop(obj.scrollTop);
                                        } else if (obj.scrollLeft) {
                                            disableScrollSync = true;
                                            editor.getSession().setScrollLeft(obj.scrollLeft);
                                        }

                                        applyChangesLater(scope);
                                    });


                                    function prepareUserData () {
                                        var marker = Math.random().toString(16).slice(2, 8);

                                        scope.currentUser.marker = marker;

                                        return {
                                            name: user.name,
                                            id: user.userId,
                                            marker: marker
                                        };
                                    }
                                });

                                _.each(scope.workspace.tabs, function (tab, tabName) {
                                    openShareJsDocForTab(docName, tabName);
                                });
                            }

                            //-------------- END CODE-SHARE ----------------------------------


                            editor.getSession().setUndoManager(undoManager);


                            scope.$watch('output.sideBySide', function () {
                                scope.output.show = false;
                                // Refresh view
                                triggerChangeLater(scope);
                                editor.resize();
                            });

                            ///

                            // TODO [ToDr] When changing tabs cursor synchronization is triggered like crazy.
                            var disableSync = false;

                            function withoutSync (call) {
                                disableSync = true;
                                call();
                                disableSync = false;
                            }

                            editor.on('change', function () {
                                if (disableSync) {
                                    return;
                                }
                                syncEditorContent(editor, scope.activeTab, scope.workspace.active,
                                    scope.isWorkspaceReadOnly());
                                triggerSave();
                                applyChangesLater(scope);
                            });

                            editor.on('mousedown', function () {
                                disableScrollSync = false;
                            });

                            editor.getSession().on('changeScrollTop', function (yPos) {
                                if ($state && !disableScrollSync && !readOnly) {
                                    $state.shout({
                                        scrollTop: yPos
                                    });
                                }

                            });

                            editor.getSession().on('changeScrollLeft', function (yPos) {
                                if ($state && !disableScrollSync && !readOnly) {
                                    $state.shout({
                                        scrollLeft: yPos
                                    });
                                }

                            });

                            function syncEditorOptionsOnSelectionOrCurosrChange () {
                                if (disableSync) {
                                    return;
                                }
                                scope.activeTab.editor = scope.activeTab.editor || {};
                                syncEditorOptions(editor, scope.activeTab.editor, scope.workspace.active,
                                    scope.isWorkspaceReadOnly(), scope.currentUser);
                                triggerSave();
                                applyChangesLater(scope);
                            }

                            editor.getSession().getSelection().on('changeSelection', syncEditorOptionsOnSelectionOrCurosrChange);

                            editor.getSession().getSelection().on('changeCursor', syncEditorOptionsOnSelectionOrCurosrChange);


                            //editor.getSession().on('changeBackMarker', function(){
                            //    console.log('changeBackMarker', arguments);
                            //});

                            // Active tab
                            scope.$watch('activeTab.mode', function (mode) {
                                if (!mode) {
                                    return;
                                }
                                updateMode(editor, scope.workspace.active, mode);
                            });

                            scope.$watch('activeTab.content', function (content) {
                                if (!content) {
                                    return;
                                }

                                if (scope.mode === 'player') {
                                    withoutSync(function () {
                                        updateEditorContent(editor, scope.activeTab);
                                    });
                                }
                                triggerChangeLater(scope);
                            });


                            scope.hasFormatting = function () {
                                var ext = getExtension(scope.workspace.active);
                                return !!jsBeautify[ext];
                            };

                            scope.formatTab = function () {
                                // check
                                if (!scope.hasFormatting()) {
                                    return;
                                }
                                var ext = getExtension(scope.workspace.active);
                                scope.activeTab.content = jsBeautify[ext](scope.activeTab.content, {
                                    indent_size: indentSize
                                });

                                withoutSync(function () {
                                    updateEditorContent(editor, scope.activeTab);
                                });
                            };

                            scope.$watch('activeTab.editor', function () {
                                if (scope.mode !== 'player') {
                                    return;
                                }

                                withoutSync(function () {
                                    updateEditorOptions(editor, scope.activeTab);
                                });
                            });

                            scope.$watch('activeTab', function () {
                                if (!scope.activeTab) {
                                    return;
                                }
                                //if ($state && !isRemoteWorkspace && !readOnly) {
                                //    $state.shout({
                                //        newTab: scope.workspace.active
                                //    });
                                //}
                                //isRemoteWorkspace = false;

                                withoutSync(function () {
                                    updateEditorContent(editor, scope.activeTab);
                                    updateEditorOptions(editor, scope.activeTab);
                                });
                            });

                            scope.$watch('workspace', refreshActiveTab.bind(null, scope));

                            scope.$on('slide:update', function () {
                                refreshActiveTab(scope);
                            });

                            // Tab switch
                            scope.$watch('workspace.active', function (newTab, oldTab) {
                                withoutSync(function () {
                                    var ws = scope.workspace;
                                    var active = ws.active;
                                    scope.activeTab = ws.tabs ? ws.tabs[active] : null;
                                    if (!scope.activeTab) {
                                        return;
                                    }
                                    if (newTab !== oldTab) {
                                        editor.getSession().getUndoManager().setUpTabsSwitched(true);
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


        function refreshActiveTab (scope) {
            var ws = scope.workspace;
            scope.activeTab = ws.tabs[ws.active];
        }

        function syncEditorContent (editor, tab, tabName, readOnly) {
            var tabState = $stateMap[tabName];
            tab.content = editor.getValue();

            if (readOnly) {
                return;
            }


            if (tabState !== undefined) {
                tabState.del(0, tabState.getText().length);
                tabState.insert(0, tab.content);
            } else if ($state) {
                $state.del(0, $state.getText().length);
                $state.insert(0, tab.content);
            }
        }

        function syncEditorOptions (editor, options, tabName, readOnly, user) {
            var tabState = $stateMap[tabName],
                msg = {
                    editor: options,
                    who: user.name,
                    marker: user.marker
                };

            options.cursorPosition = editor.getCursorPosition();
            options.selectionRange = JSON.parse(JSON.stringify(editor.getSelectionRange()));
            options.firstVisibleRow = editor.getFirstVisibleRow();
            options.lastVisibleRow = editor.getLastVisibleRow();

            if (readOnly) {
                return;
            }

            if (tabState !== undefined) {
                tabState.shout(msg);
            }
            else if ($state) {
                $state.shout(msg);
            }
        }

        function updateEditorContent (editor, tab, forceUpdateCursor) {
            // Remember cursor
            var pos = editor.getSelectionRange();
            editor.setValue(tab.content, -1);
            // Restore cursor
            editor.getSelection().setSelectionRange(pos, false);
            // Handle scrolling
            updateEditorOptions(editor, tab, forceUpdateCursor);
        }

        function updateEditorSelection (editor, tab, forceUpdateCursor) {
            var lastRow = editor.getLastVisibleRow();
            var selection = editor.getSelection();
            var range = tab.editor.selectionRange;
            // TODO [ToDr] Trying to remove strange flickering
            if (forceUpdateCursor || range.start.row < lastRow) {
                selection.setSelectionRange(range, false);
            }
        }

        function updateEditorScroll (editor, tab) {
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

        function updateEditorOptions (ed, tab, forceUpdateCursor) {
            if (!tab || !tab.editor) {
                return;
            }
            updateEditorSelection(ed, tab, forceUpdateCursor);
            updateEditorScroll(ed, tab);
            setUpMarker(ed, tab);
        }

        function initUserMarker (who, marker) {
            if (!markers[who]) {
                markers[who] = {
                    lastMarker: 0,
                    marker: marker
                };
            }
        }

        function removeUserMarker (ed, who) {
            var lastMarker = markers[who].lastMarker;

            if (lastMarker > 0) {
                ed.session.removeMarker(lastMarker);
            }
        }

        function setUpMarker (ed, tab) {
            var selectionRange = tab.editor.selectionRange,
                Range = ace.require('ace/range').Range, lastMarker;

            initUserMarker(tab.who, tab.marker);
            removeUserMarker(ed, tab.who);

            if (selectionRange.start.column === selectionRange.end.column) {

                markers[tab.who].lastMarker = ed.session.addMarker(
                    new Range(selectionRange.start.row, selectionRange.start.column,
                        selectionRange.end.row, selectionRange.end.column + 1), "user-marker", function (stringBuilder, range, left, top, config) {
                        var height = config.lineHeight;

                        stringBuilder.push(
                            "<div class='user-marker ace_active-line'",
                            "data-name='", tab.who, "'",
                            "style='height:", height, "px;",
                            "background:#", tab.marker, ";",
                            "top:", top, "px;",
                            "left:", left, "px;right:0;'></div>"
                        );
                    });
            }
        }

        function getExtension (name) {
            var name2 = name.split('|');
            return name2[name2.length - 1];
        }

        function updateMode (editor, name, givenMode) {
            var modesMap = {
                'js': 'javascript',
                'es6': 'javascript'
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

        function handleErrorListeners (scope, $window) {
            // Errors forwarder
            var listener = function (ev) {
                var d = ev.data;
                if (d.type !== 'fiddle-error') {
                    return;
                }
                scope.$apply(function () {
                    scope.errors = d.msg;
                });
            };

            $window.addEventListener('message', listener);
            scope.$on('$destroy', function () {
                $window.removeEventListener('message', listener);
            });
        }

    });
