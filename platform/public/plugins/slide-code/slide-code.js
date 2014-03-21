define(['_', 'slider/slider.plugins', 'ace'], function(_, sliderPlugins, ace) {

    var EDITOR_THEME = 'todr';


    var getCodeData = function(code) {
        if (!_.isObject(code)) {
            code = {
                content: code,
                mode: 'javascript'
            };
        }
        return code;
    };

    var triggerCodeChange = function(ev, editor) {
        sliderPlugins.trigger.apply(sliderPlugins, ['slide.slide-code.change', ev, editor]);
    };

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
                template: '<div class="editor"><div></div></div>',
                link: function(scope, element) {
                    var code = getCodeData(scope.code);

                    editor = ace.edit(element[0].childNodes[0]);
                    editor.setTheme("ace/theme/" + EDITOR_THEME);
                    editor.getSession().setMode('ace/mode/' + code.mode);

                    editor.on('change', triggerCodeChange);
                    editor.setValue(code.content);

                    //TODO some mechanism to run piece of code after all plugins are loaded?
                    $timeout(function() {
                        triggerCodeChange({}, editor);
                    }, 500);
                },
            };
        }
    ]);

});