'use strict';

var EDITOR_THEME = 'todr';

var Sockets = {
    socket: io.connect(SOCKET_URL)
};



// editor
(function() {
    var editor = ace.edit(document.querySelector('.presentation-edit'));
    editor.setTheme("ace/theme/" + EDITOR_THEME);
    editor.getSession().setMode('ace/mode/yaml');

    var saveAndReload = function() {
        var data = editor.getValue();
        Sockets.socket.emit('saveSlidesContent', presentation, data);
        document.querySelector('iframe').contentWindow.location.reload();
        JsonStorage.set('content-' + presentation, data);
    };
    editor.on('change', _.debounce(saveAndReload, 300));

    Sockets.socket.on('slidesContent', function(data) {
        editor.setValue(data);
    });

    Sockets.socket.emit('getSlidesContent', presentation);
}());