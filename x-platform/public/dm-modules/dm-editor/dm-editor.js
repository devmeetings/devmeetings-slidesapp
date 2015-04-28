define(['angular', '_', 'ace'], function(angular, _, ace) {
  'use strict';

  var EDITOR_THEME = 'todr';

  var applyChangesLater = _.debounce(function(scope) {
    scope.$apply();
  }, 300);

  angular.module('dm-editor', []).directive('dmEditor', [
    '$timeout',
    function($timeout) {

      return {
        restrict: 'E',
        replace: true,
        scope: {
          size: '=',
          options: '=',
          undoManager: '=',
          data: '=',
          name: '=',
          editorMode: '=',
          triggerSave: '&',
          triggerChangeLater: '&',
        },
        templateUrl: '/static/dm-modules/dm-editor/dm-editor.html',
        link: function(scope, element) {
          // Editor

          var triggerChangeLater = scope.triggerChangeLater;
          var triggerSave = scope.triggerSave;

          function updateMode(name) {
            if (!scope.data) {
              return;
            }
            scope.mode = getMode(name, scope.data.mode);
          }
          scope.$watch('name', function(name){
            name = name || "";
            updateMode(name);
            scope.dotName = name.replace(/\|/g, '.');
          });


          /* 
           * [ToDr] Not sure why we need to introduce timeout here,
           * But when there is no timeout syntax highlighting doesnt work after loading editor
           * for the second time.
           */
          var $e = element.find('.editor');
          $timeout(function() {

            var indentSize = 2;
            var editor = ace.edit($e[0]);
            editor.$blockScrolling = Infinity;
            editor.setTheme('ace/theme/' + EDITOR_THEME);
            editor.setValue('');
            editor.getSession().setTabSize(indentSize);
            editor.getSession().setUseSoftTabs(true);
            editor.getSession().setUseWrapMode(!!scope.options.wrap);
            editor.setOptions({
              enableBasicAutocompletion: !scope.options.noAutocomplete,
              enableSnippets: !scope.options.noAutocomplete,
              behavioursEnabled: !scope.options.noAutocomplete
            });

            function focusEditor() {
              // Don't lose focus when playing a movie!
              if (scope.editorMode !== 'player') {
                editor.focus();
              }
            }
            focusEditor();

            (function vimMode() {
              if (scope.options.vim || (localStorage && localStorage.getItem('vimMode'))) {
                editor.setKeyboardHandler('ace/keyboard/vim');
              }
            }());

            if (scope.undoManager) {
              editor.getSession().setUndoManager(scope.undoManager);
            }

            scope.$on('resize', function() {
              editor.resize();
            });

            scope.$on('update', function() {
              if (!scope.data) {
                return;
              }
              updateMode(scope.name);
              updateEditorContent(editor, scope.data);
              focusEditor();
              triggerSave();
            });


            // TODO [ToDr] When changing tabs cursor synchronization is triggered like crazy.
            var disableSync = false;

            function withoutSync(call) {
              disableSync = true;
              call();
              disableSync = false;
            }

            editor.on('change', function() {
              if (disableSync) {
                return;
              }
              syncEditorContent(editor, scope.data);
              triggerSave();
              applyChangesLater(scope);
            });

            editor.getSession().getSelection().on('changeCursor', function() {
              if (disableSync) {
                return;
              }
              scope.data.editor = scope.data.editor || {};
              syncEditorOptions(editor, scope.data.editor);
              triggerSave();
              applyChangesLater(scope);
            });

            scope.$watch('mode', function(mode) {
              if (!mode) {
                return;
              }
              editor.getSession().setMode('ace/mode/' + mode);
            });

            scope.$watch('data.content', function(content) {
              if (!content) {
                return;
              }

              if (scope.editorMode === 'player') {
                withoutSync(function() {
                  updateEditorContent(editor, scope.data);
                });
              }
              triggerChangeLater(scope);
            });

            scope.$watch('editorMode', function(){
              editor.setReadOnly(scope.editorMode === 'player');
            });

            scope.$watch('data.editor', function() {
              if (scope.editorMode !== 'player') {
                return;
              }
              // sometimes editor is not visible yet
              $timeout(function(){
                withoutSync(function() {
                  updateEditorOptions(editor, scope.data);
                });
              }, 30);
            }, true);

            scope.$watch('data', function() {
              if (!scope.data) {
                return;
              }
              withoutSync(function() {
                updateMode(scope.name);
                updateEditorContent(editor, scope.data);
                updateEditorOptions(editor, scope.data);
              });
            });

            editor.resize();

            scope.$on('$destroy', function() {
              editor.destroy();
            });
          }, 150);
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
    name = name || '';
    var name2 = name.split('|');
    return name2[name2.length - 1];
  }

  function getMode(name, givenMode) {
    var modesMap = {
      'js': 'javascript',
      'es6': 'javascript'
    };

    var mode;
    if (givenMode) {
      return givenMode;
    }

    mode = getExtension(name) || 'text';
    mode = modesMap[mode] || mode;
    return mode;
  }


});
