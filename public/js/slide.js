(function(){

    setTimeout(function(){
        $(document.body).addClass('loaded');
    }, 200);

    var output = document.querySelector('#output');
    var errors = document.querySelector('#errors');
    
    // When slide contains only text don't do nothing.
    if (!output) {
        return;
    }
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
        if (window.parent) {
            window.parent.postMessage({
                type: 'codeupdate', 
                code: value
            }, window.location);
        }
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
$(function(){
    setTimeout(function(){
        $('.main-content').addClass('in');
    }, 200);
});