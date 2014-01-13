// Create fiddle editors
(function() {
    var aceStd = function(selector, mode) {
        var editor = ace.edit(selector);
        editor.setTheme("ace/theme/monokai");
        editor.getSession().setMode('ace/mode/' + mode);
        return editor;
    };

    var fixOneLineComments = function(code) {
        return code.replace(/\/\/(.*)/g, function(match, reg1) {
            return '/* ' + reg1 + ' */'
        });
    };

    var iframe = document.querySelector('#fiddle-output');

    var host = window.location.origin;

    var commonCss = [
        '<link href="' + host + '/css/bootstrap-cyborg.css" rel="stylesheet">',
        '<link href="' + host + '/css/styles.css" rel="stylesheet">'
    ].join("\n");
    var commonJs = [
        '<script src="https://code.jquery.com/jquery.js"></script>',
        '<script src="' + host + '/js/underscore-1.5.2.js"></script>',
        '<script src="' + host + '/js/bootstrap.min.js"></script>',
    ].join("\n");

    if (!iframe) {
        return;
    }

    var jsEditor = aceStd('editor-js', 'javascript');
    var cssEditor = aceStd('editor-css', 'css');
    var htmlEditor = aceStd('editor-html', 'html');
    var isPure = iframe.hasAttribute('data-pure');

    var updateOutput = function() {
        var jsCode = (isPure ? '' : commonJs) + "<script>" + fixOneLineComments(jsEditor.getValue()) + "</script>";
        var cssCode = (isPure ? '' : commonCss) + "<style>" + fixOneLineComments(cssEditor.getValue()) + "</style>";
        var htmlCode = htmlEditor.getValue();

        if (htmlCode.search("</body>")) {
            htmlCode = htmlCode.replace("</body>", jsCode + "</body>");
        } else {
            htmlCode += jsCode;
        }
        if (htmlCode.search("</head>")) {
            htmlCode = htmlCode.replace("</head>", cssCode + "</head>");
        } else {
            htmlCode = cssCode + htmlCode;
        }
        iframe.src = "data:text/html;charset=utf-8," + htmlCode;

    };
    var updateOutputLater = _.debounce(updateOutput, 700);
    jsEditor.on('change', updateOutputLater);
    cssEditor.on('change', updateOutputLater);
    htmlEditor.on('change', updateOutputLater);
    updateOutputLater();
}());

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
        java: {
            editor: 'java',
            run: false
        },
        default: {
            editor: 'plain_text',
            run: false
        }
    };


    setTimeout(function() {
        $(document.body).addClass('loaded');
    }, 200);

    var output = document.querySelector('#output');
    var errors = document.querySelector('#errors');

    // When slide contains only text don't do nothing.
    if (!output) {
        return;
    }

    var codeLanguage = document.querySelector('#editor').getAttribute('data-language');

    var mode = MODES[codeLanguage] || MODES['default'];

    var monitorVariable = output.getAttribute('data-monitor');
    var isAsync = output.hasAttribute('data-async');

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
            value += "\n\n;return " + monitorVariable + ";";
        }
        try {
            var result = eval("(function(){" + value + "}())");

            var displayOutput = function(res) {
                var json = JSON.stringify(res, null, 2);
                outputAce.setValue(json);
                outputAce.clearSelection();
                inspector.view(json);
                errors.innerHTML = "";
            };

            displayOutput(result);

            if (isAsync) {
                result.done(function(data) {
                    setTimeout(function() {
                        displayOutput(data);
                    }, 1000);
                });
            }
        } catch (e) {
            console.error(e);
            errors.innerHTML = e;
        }
    };

    if (mode.run) {
        editor.on('change', _.debounce(runContent, 700));
        runContent();
    }
    if (!mode.run || output.getAttribute('data-hide') === 'true') {
        //hide output
        output.className = 'hidden';
    }
}());

// Task support
(function() {
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

    var sounds = new Howl({
        urls: ['sounds/sprite.mp3', 'sounds/sprite.wav'],
        sprite: {
            end: [0, 3900],
            warn: [4000, 6500],
            notify: [7000, 8250]
        }
    });

    var state = {
        isRunning: false,
        startTime: 0,
        endTime: 0,
        timeLeft: 0,
        sentNotifications: {},

        update: function updateState() {
            //update state
            if (!this.isRunning) {
                this.startTime = date();
                this.sentNotifications = {};
            }
            this.endTime = date(this.startTime + taskDuration * 60 * 1000);
            this.timeLeft = this.endTime - date();

            //display gui
            setTimeout(updateState.bind(this), 5000);

            if (!this.isRunning) {
                return;
            }

            if (this.timeLeft < 5000) {
                new Notification("Time's up!");
                sounds.play('end');
                this.isRunning = false;
            } else if (this.timeLeft < 2 * 60 * 1000) {
                if (!this.sentNotifications['2']) {
                    this.sentNotifications['2'] = new Notification("Only 2 minutes left!");
                    sounds.play('warn');
                }
            } else if (this.timeLeft < 5 * 60 * 1000) {
                if (!this.sentNotifications['5']) {
                    this.sentNotifications['5'] = new Notification("Only 5 minutes left!");
                    sounds.play('notify');
                }
            }

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

    $button.addEventListener('click', function() {
        Notification.requestPermission();
        state.isRunning = !state.isRunning;
        displayState();
    });
}());
$(function() {
    setTimeout(function() {
        $('.main-content').addClass('in');
    }, 200);
});