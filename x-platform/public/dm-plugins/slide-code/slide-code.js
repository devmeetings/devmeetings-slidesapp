/* globals define */
define(
  ['_', 'slider/slider.plugins', 'ace', 'ace_languageTools', '../slide-workspace/throttle.es6'],
  function (_, sliderPlugins, ace, aceLangTools, throttle) {
    ace = ace.default;

    var EDITOR_THEME = 'todr';

    var throttleOptions = {
      leading: false,
      trailing: true
    };

    var saveSlideLater = _.throttle(function (scope) {
      throttle.default.safeApply(scope);
    }, 100);

    var triggerEventLater = _.throttle(function (scope, code, ev, editor) {
      sliderPlugins.trigger('slide.slide-code.change', ev, editor, scope.path);
    }, 100, throttleOptions);

    var getCodeData = function (code) {
      if (!_.isObject(code)) {
        code = {
          content: code,
          size: 'md',
          mode: 'javascript'
        };
      }
      return code;
    };

    var triggerCodeChange = function (scope, code, ev, editor) {
      code.content = editor.getValue();
      triggerEventLater(scope, code, ev, editor);
      saveSlideLater(scope);
    };

    var triggerCursorChange = function (scope, code, editor) {
      code.aceOptions = {
        cursorPosition: editor.getCursorPosition(),
        selectionRange: JSON.parse(JSON.stringify(editor.getSelectionRange())),
        firstVisibleRow: editor.getFirstVisibleRow(),
        lastVisibleRow: editor.getLastVisibleRow()
      };
      saveSlideLater(scope);
    };

    sliderPlugins.registerPlugin('slide', 'code', 'slide-code', {
      order: 3000,
      name: 'Code Editor',
      description: 'Simple code editor. It does not execute code by default',
      example: {
        meta: {
          content: 'string',
          size: {
            type: 'enum',
            values: ['xs', 'sm', 'md', 'xl', 'xxl']
          },
          mode: {
            type: 'enum',
            values: ['javascript', 'any ace mode']
          }
        },
        data: {
          mode: 'javascript',
          size: 'md',
          content: 'console.log("asd")'
        }
      }
    }).directive('slideCode', [
      '$timeout',
      function ($timeout) {
        var editor = null;

        return {
          restrict: 'E',
          scope: {
            code: '=data',
            path: '@',
            slide: '=context'
          },
          template: '<div class="editor editor-{{ code.size }}"><div></div></div>',
          link: function (scope, element) {
            scope.code = getCodeData(scope.code);

            $timeout(function () {
              editor = ace.edit(element[0].childNodes[0]);
              editor.setTheme('ace/theme/' + EDITOR_THEME);
              editor.setFontSize(16);
              editor.$blockScrolling = Infinity;
              editor.setOptions({
                enableBasicAutocompletion: true,
                enableSnippets: true,
                enableLiveAutocompletion: false
              });

              scope.$watch('code.mode', function () {
                if (!scope.code) {
                  return;
                }
                editor.getSession().setMode('ace/mode/' + scope.code.mode);
              });

              editor.on('change', function (ev, editor) {
                triggerCodeChange(scope, scope.code, ev, editor);
              });

              $timeout(function () {
                triggerCodeChange(scope, scope.code, {}, editor);
              }, 500);

              editor.getSession().getSelection().on('changeCursor', function () {
                triggerCursorChange(scope, scope.code, editor);
              });

              scope.$watch('code.content', function (content) {
                var oldContent = editor.getValue();
                if (content && oldContent !== content) {
                  editor.setValue(content, editor.getSelection().getCursor());
                }
              });
            });
          }
        };
      }
    ]);
  });
