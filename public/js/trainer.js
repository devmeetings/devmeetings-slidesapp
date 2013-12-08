(function(){
    'use strict';

    var editor = ace.edit("editor");
    editor.setTheme("ace/theme/monokai");
    editor.getSession().setMode("ace/mode/javascript");

    var iframe = $('iframe')[0];

    window.addEventListener('message', function(ev){
        var data = ev.data;
        if (data.type !== 'slideupdate') {
            return;
        }

        editor.setValue(data.notes);
        iframe.src =  '/slide?slide='+encodeURIComponent(JSON.stringify(data.slide));
    });
}());