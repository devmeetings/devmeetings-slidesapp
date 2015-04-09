define(['_', 'slider/slider.plugins', 'ace', 'ace_languageTools'], function(_, sliderPlugins, ace) {

    var EDITOR_THEME = 'todr';

    var throttleOptions = {
        leading: false,
        trailing: true
    };

    var updateScopeLater = _.throttle(function(scope) {
        scope.$apply();
    }, 200, throttleOptions);

    var triggerEventLater = _.throttle(function(scope, code, ev, editor) {
        sliderPlugins.trigger.apply(sliderPlugins, ['slide.slide-code.change', ev, editor, scope.path]);
    }, 100, throttleOptions);

    var getCodeData = function(code) {
        if (!_.isObject(code)) {
            code = {
                content: code,
                size: 'md',
                mode: 'javascript'
            };
        }
        return code;
    };


    var triggerCodeChange = function(scope, code, ev, editor) {
        code.content = editor.getValue();
        updateScopeLater(scope);
        triggerEventLater(scope, code, ev, editor);
    };

    var triggerCursorChange = function(scope, code, editor) {
        code.aceOptions = {
            cursorPosition: editor.getCursorPosition(),
            selectionRange: JSON.parse(JSON.stringify(editor.getSelectionRange())),
            firstVisibleRow: editor.getFirstVisibleRow(),
            lastVisibleRow: editor.getLastVisibleRow()
        };
        updateScopeLater(scope);
    };

    sliderPlugins.registerPlugin('slide', 'code', 'slide-code', 3000).directive('slideCode', [
        '$timeout',
        function($timeout) {

            var editor = null;

            return {
                restrict: 'E',
                scope: {
                    code: '=data',
                    path: '@',
                    slide: '=context'
                },
                template: '<div class="editor editor-{{ code.size }}"><div></div></div>',
                link: function(scope, element) {
                    scope.code = getCodeData(scope.code);

                    $timeout(function() {
                        editor = ace.edit(element[0].childNodes[0]);
                        editor.setTheme('ace/theme/' + EDITOR_THEME);
                        editor.setOptions({
                            enableBasicAutocompletion: true,
                            enableSnippets: true,
                            enableLiveAutocompletion: false,
                        });

                        scope.$watch('code.mode', function() {
                            editor.getSession().setMode('ace/mode/' + scope.code.mode);
                        });

                        editor.on('change', function(ev, editor) {
                            triggerCodeChange(scope, scope.code, ev, editor);
                        });

                        editor.getSession().getSelection().on('changeCursor', function() {
                            triggerCursorChange(scope, scope.code, editor);
                        });

                        scope.$watch('code.content', function(content) {
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
