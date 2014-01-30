// Create fiddle editors
var EDITOR_THEME = 'todr';
var OUTPUT_THEME = 'twilight';

var SLIDE_ID = $(".main-content").data('slide-id');
var SLIDESET = $('.main-content').data('slideset');
var updateMicroTasks = function() {};

$(document.body).tooltip({
    selector: '[data-toggle=tooltip]',
    html: true
});
// Microtasks
(function() {
    var microtasksElems = document.querySelectorAll('.microtask');
    var microtasks = [].map.call(microtasksElems, function(e) {
        var getPattern = function(attr) {
            attr = "data-" + attr;
            if (e.hasAttribute(attr)) {
                var p = e.getAttribute(attr);
                try {
                    var data = JSON.parse(p);
                    return {
                        test: function(json) {
                            return _.isEqual(json, data);
                        }
                    };
                } catch (e) {
                    //it's ok, it must be regexp then
                }
                return new RegExp(p.trim(), "m");
            }
            return new RegExp('.*');
        };
        var getJsAssert = function() {
            var attr = 'data-js-assert';
            if (!e.hasAttribute(attr)) {
                return function() {
                    return true;
                };
            }
            var assertion = $.trim(e.getAttribute(attr));

            return function(jsCode) {
                jsCode += "; try { return (" + assertion + ") || false; } catch(e) { return false; }";
                var evalCode = "(function(){" + jsCode + "}());";
                var result = eval(evalCode);
                return result;
            };
        };
        var cssPattern = getPattern("css");
        var jsPattern = getPattern("js");
        var htmlPattern = getPattern("html");
        var outputPattern = getPattern("output");
        var jsAssert = getJsAssert();

        return {
            elem: e,
            description: $(e).find('.microtask-text').text(),
            isFinished: function(output, jsCode, htmlCode, cssCode) {
                return outputPattern.test(output) &&
                    jsPattern.test(jsCode) &&
                    htmlPattern.test(htmlCode) &&
                    cssPattern.test(cssCode) &&
                    jsAssert(jsCode);
            }
        };
    });
    var notCompletedMicrotasks = function(task) {
        return !task.isCompleted;
    };

    var microTaskId = 'microtasks-' + SLIDESET + SLIDE_ID;
    var savedMicrotasks = JsonStorage.get(microTaskId, {});
    updateMicroTasks = function(output, jsCode, htmlCode, cssCode) {
        microtasks.filter(notCompletedMicrotasks).forEach(function(task) {
            var isFinished = task.isFinished(output, jsCode, htmlCode, cssCode);
            isFinished = savedMicrotasks[task.description] || isFinished;
            task.isCompleted = isFinished;
            savedMicrotasks[task.description] = isFinished;
            $(task.elem).toggleClass("alert-success", isFinished).toggleClass('alert-danger', !isFinished);

            JsonStorage.set(microTaskId, savedMicrotasks);
        });
    };
    $(window).on('beforeunload', function() {
        if (microtasks.filter(notCompletedMicrotasks).length) {
            setTimeout(function() {
                setTimeout(function() {
                    if (window.parent) {
                        window.parent.postMessage({
                            type: 'navcanceled'
                        }, window.location);
                    }
                }, 500);
            }, 1);
            return "You haven't finished all tasks!";
        }
    });
    updateMicroTasks();
}());

// Fiddle support
(function() {
    var aceStd = function(selector, mode) {
        var editor = ace.edit(selector);
        editor.setTheme("ace/theme/" + EDITOR_THEME);
        editor.getSession().setMode('ace/mode/' + mode);
        return editor;
    };

    var fixOneLineComments = function(code) {
        return code.replace(/(.*)\/\/(.*)/g, function(match, reg1, reg2) {
            // but don't break links! - This is shitty as fuck!
            if (/.*http[s]?\:$/.test(reg1)) {
                return match
            }
            return '/* ' + reg2 + ' */'
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
    var coffeeEditor = aceStd('editor-coffee', 'coffee');
    var cssEditor = aceStd('editor-css', 'css');
    var htmlEditor = aceStd('editor-html', 'html');
    var isPure = iframe.hasAttribute('data-pure');
    var errors = document.querySelector('.errors-fiddle');

    var updateOutput = function() {
        var jsCodeRaw = 'try { ' + fixOneLineComments(jsEditor.getValue()) + ';window.parent.postMessage({msg: ""}, "' + host + '");} catch (e) { console.error(e); window.parent.postMessage({msg: e.message}, "' + host + '"); }';
        var jsCode = (isPure ? '' : commonJs) + "<script>" + jsCodeRaw + "</script>";
        var cssCode = (isPure ? '' : commonCss) + "<style>" + fixOneLineComments(cssEditor.getValue()) + "</style>";
        var htmlCode = htmlEditor.getValue();
        var coffee = coffeeEditor.getValue();
        var coffeeCompiled = "";

        if (coffee) {
            coffeeCompiled = CoffeeScript.compile(coffee);
            jsCode += '<script>' + coffeeCompiled + '</script>';
        }

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
        updateMicroTasks(htmlCode, jsEditor.getValue() + coffeeCompiled, htmlEditor.getValue(), cssEditor.getValue());

        iframe.src = "data:text/html;charset=utf-8," + htmlCode;
    };

    var updateOutputLater = _.debounce(updateOutput, 700);
    jsEditor.on('change', updateOutputLater);
    coffeeEditor.on('change', updateOutputLater);
    cssEditor.on('change', updateOutputLater);
    htmlEditor.on('change', updateOutputLater);
    updateOutputLater();

    window.addEventListener('message', function(ev) {
        errors.innerHTML = ev.data.msg;
    });
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
        coffee: {
            editor: 'coffee',
            process: function(code) {
                return CoffeeScript.compile(code, {
                    bare: true
                });
            },
            run: true
        },
        'javascript-norun': {
            editor: 'javascript',
            run: false
        },
        default: {
            editor: 'plain_text',
            run: false
        }
    };


    setTimeout(function() {
        $(document.body).addClass('loaded');
    }, 2000);

    var allOutputs = document.querySelectorAll('.output');

    // When slide contains only text don't do nothing.
    if (!allOutputs.length) {
        return;
    }
    [].slice.call(allOutputs).forEach(function(output, k) {
        var queryAll = function(query) {
            return document.querySelectorAll(query)[k];
        };

        var errors = queryAll('.errors-code');

        var codeLanguage = queryAll('.code-editor').getAttribute('data-language');

        var mode = MODES[codeLanguage] || MODES['default'];

        var monitorVariable = output.getAttribute('data-monitor');
        var isAsync = output.hasAttribute('data-async');

        var outputAce = ace.edit(queryAll('.output-ace'));
        outputAce.setTheme("ace/theme/" + OUTPUT_THEME);
        outputAce.getSession().setMode("ace/mode/json");
        outputAce.setReadOnly(true);
        outputAce.setHighlightActiveLine(false);
        outputAce.setShowPrintMargin(false);
        outputAce.renderer.setShowGutter(false);

        var inspector = new InspectorJSON({
            element: queryAll('.output-json')
        });


        var editor = ace.edit(queryAll(".code-editor"));
        editor.setTheme("ace/theme/" + EDITOR_THEME);
        editor.getSession().setMode("ace/mode/" + mode.editor);

        var runContent = function() {
            var code = editor.getValue();

            if (mode.process) {
                code = mode.process(code);
            }

            if (window.parent) {
                window.parent.postMessage({
                    type: 'codeupdate',
                    code: code
                }, window.location);
            }
            var value = code;
            if (monitorVariable) {
                value += "\n\n;return " + monitorVariable + ";";
            }
            try {
                var result = eval("(function(){" + value + "}())");

                updateMicroTasks(result, code);
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
    });
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
// Full-screen editor
(function() {
    $('body').on('click', '.editor-change-size', function() {
        var $t = $(this);
        var $x = $t.parent();
        $x.toggleClass('editor-full-screen');
        var isFullScreen = $x.hasClass('editor-full-screen');
        $t.toggleClass('glyphicon-fullscreen', !isFullScreen).toggleClass('glyphicon-remove-circle', isFullScreen);
        $x.find('.editor').each(function() {
            ace.edit(this).resize();
        });
    });
    $(document).bind('keyup', 'esc', function() {
        $('.editor-full-screen').removeClass('editor-full-screen');
    });
}());
$(function() {
    setTimeout(function() {
        $('.main-content').addClass('in');
    }, 180);
});