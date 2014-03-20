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

    sliderPlugins.registerPlugin('slide', 'code', 'slide-code').directive('slideCode', [

        function() {
            return {
                restrict: 'E',
                scope: {
                    code: '=data',
                    slide: '=context'
                },
                template: '<div class="editor"><div></div></div>',
                link: function(scope, element) {
                    var code = getCodeData(scope.code);

                    var editor = ace.edit(element[0].childNodes[0]);
                    editor.setTheme("ace/theme/" + EDITOR_THEME);
                    editor.getSession().setMode('ace/mode/' + code.mode);
                    editor.setValue(code.content);
                }
            };
        }
    ]);

});