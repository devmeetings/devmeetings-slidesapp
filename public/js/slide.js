(function() {
    var MODES = {
        javascript: {
            editor: 'javascript',
            run: true
        },
        html: {
            editor: 'html',
            run: false
        },
        default: {
            editor: 'plain_text',
            run:false
        }
    };


    setTimeout(function(){
        $(document.body).addClass('loaded');
    }, 200);

    var output = document.querySelector('#output');
    var errors = document.querySelector('#errors');
    
    // When slide contains only text don't do nothing.
    if (!output) {
        return;
    }

    var codeLanguage = document.querySelector('#editor').getAttribute('data-language');

    var mode = MODES[codeLanguage] || MODES.default;

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
    editor.getSession().setMode("ace/mode/" + mode.editor);

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

    if (mode.run) {
        editor.on('change', _.debounce(runContent, 700));
        runContent();
    } else {
        //hide output
        output.className = 'hidden';
    }
}());
// Task support
(function(){
    var $timeLeft = document.querySelector('.task-time-left');
    var $startTime = document.querySelector('.task-start-time');
    var $endTime = document.querySelector('.task-end-time');
    var $button = document.querySelector('.task-start-btn');

    if (!$timeLeft) {
        return;
    }

    var date = function(v) {
        if (v) {
            return new Date(v).getTime();
        }
        return new Date().getTime();
    };
    var toTime = function(date) {
        var pad = function(val) {
            return (val < 10) ? "0" + val : val;
        };
        var t = new Date(date);
        return pad(t.getHours()) + ":" + pad(t.getMinutes());
    };
    var toInt = function(t) {
        return parseInt(t, 10);
    };

    var taskDuration = toInt($timeLeft.getAttribute('data-duration'));

    var state = {
        isRunning: false,
        startTime: 0,
        endTime: 0,
        timeLeft: 0,

        update: function updateState() {
            //update state
            if (!this.isRunning) {
                this.startTime = date();
            }
            this.endTime = date(this.startTime + taskDuration * 60 * 1000);
            this.timeLeft = this.endTime - date();

            //display gui
            setTimeout(updateState.bind(this), 5000);
        }
    };
    state.update();

    // GUI
    var displayState = function displayState() {

        $timeLeft.innerHTML = toInt(state.timeLeft / 60 / 1000)

        $startTime.innerHTML = toTime(state.startTime);
        $endTime.innerHTML = toTime(state.endTime);

        var $icon = $($button.querySelector('span'));
        $icon.toggleClass('glyphicon-play', !state.isRunning);
        $icon.toggleClass('glyphicon-stop', state.isRunning);

        setTimeout(displayState, 10000);
    };
    displayState();

    $button.addEventListener('click', function(){
        state.isRunning = !state.isRunning;
        displayState();
    });
}());
$(function(){
    setTimeout(function(){
        $('.main-content').addClass('in');
    }, 200);
});