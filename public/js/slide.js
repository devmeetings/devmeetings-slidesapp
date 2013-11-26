(function(){
    var output = document.querySelector('#output');
    var errors = document.querySelector('#errors');
    var monitorVariable = output.getAttribute('data-monitor');

    var outputAce = ace.edit('output-ace');
    outputAce.setTheme("ace/theme/twilight");
    outputAce.getSession().setMode("ace/mode/json");
    outputAce.setReadOnly(true);
    outputAce.setHighlightActiveLine(false);
    outputAce.setShowPrintMargin(false);
    outputAce.renderer.setShowGutter(false);

    var inspector = new InspectorJSON({
        element: 'output-json'
    });


    var editor = ace.edit("editor");
    editor.setTheme("ace/theme/monokai");
    editor.getSession().setMode("ace/mode/javascript");

    var runContent = function() {
        var value = editor.getValue();
        if (monitorVariable) {
            value += ";return "+monitorVariable+";";
        }
        try {
            var result = eval("(function(){" +value +"}())");
            var json = JSON.stringify(result, null, 2);
            outputAce.setValue(json);
            outputAce.clearSelection();
            inspector.view(json);
            errors.innerHTML = "";
        } catch (e) {
            console.error(e);
            errors.innerHTML = e;
        }
    };

    editor.on('change', _.debounce(runContent, 700));

    runContent();
}());