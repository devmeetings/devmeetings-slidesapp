define(['_', 'slider/slider.plugins', 'ace', 'ace-languageTools'], function(_, sliderPlugins, ace) {

    var EDITOR_THEME = 'todr';


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

    var triggerCodeChange = _.throttle(function(scope, code, ev, editor) {
        scope.$apply(function() {
            code.content = editor.getValue();
        });
        sliderPlugins.trigger.apply(sliderPlugins, ['slide.slide-code.change', ev, editor]);
    }, 100, {
        leading: false,
        trailing: true
    });

    var safeApply = function(fn) {
        var phase = this.$root.$$phase;

        if (phase == '$apply' || phase == '$digest') {
            if (fn && (typeof(fn) === 'function')) {
                fn();
            }
        } else {
            this.$apply(fn);
        }
    };

    var triggerCursorChange = _.throttle(function(scope, code, editor) {
        safeApply.call(scope, function() {
            code.aceOptions = {
                cursorPosition: editor.getCursorPosition(),
                selectionRange: editor.getSelectionRange(),
                firstVisibleRow: editor.getFirstVisibleRow(),
                lastVisibleRow: editor.getLastVisibleRow()
            };
        });
    }, 100, {
        leading: false,
        trailing: true
    });

    sliderPlugins.registerPlugin('slide', 'code', 'slide-code', 3000).directive('slideCode', [
        '$timeout',
        function($timeout) {

            var editor = null;

            return {
                restrict: 'E',
                scope: {
                    code: '=data',
                    slide: '=context'
                },
                template: '<div class="editor editor-{{ code.size }}"><div></div></div>',
                link: function(scope, element) {
                    scope.code = getCodeData(scope.code);

                    $timeout(function() {
                        editor = ace.edit(element[0].childNodes[0]);
                        editor.setTheme("ace/theme/" + EDITOR_THEME);
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