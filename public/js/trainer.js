(function() {
    'use strict';

    var parentFrame = null;

    var SolutionButton = (function() {
        var $el = $('.task-solution-btn');
        var taskData = null;

        var Btn = {
            show: function(show) {
                $el.toggleClass('hidden', !show);
            },
            reset: function(newTaskData) {
                taskData = newTaskData;
                $el.text('Show task solution');
            },
            click: function() {
                parentFrame.postMessage({
                    type: 'tasksolution',
                    solution: taskData.solution
                }, window.location);
            }
        };

        $el.on('click', Btn.click.bind(Btn));

        return Btn;
    }());

    var editor = ace.edit("editor");
    editor.setTheme("ace/theme/monokai");
    editor.getSession().setMode("ace/mode/javascript");

    var iframe = $('iframe')[0];

    window.addEventListener('message', function(ev) {
        var data = ev.data;
        if (data.type !== 'slideupdate') {
            return;
        }
        parentFrame = ev.source;

        editor.setValue(data.currentSlide.notes);
        SolutionButton.show(data.currentSlide.task);
        SolutionButton.reset(data.currentSlide.task);

        iframe.src = '/slide?slide=' + encodeURIComponent(JSON.stringify(data.nextSlide));
    });

    var $doc = $(document);

    var changeSlide = function() {
        parentFrame.postMessage({
            type: 'changeslide',
            mod: this
        }, window.location);
    };
    var nextSlide = changeSlide.bind(1);
    var prevSlide = changeSlide.bind(-1);

    $doc.bind('keyup', 'right', nextSlide);
    $doc.bind('keyup', 'space', nextSlide);
    $doc.bind('keyup', 'down', nextSlide);
    $doc.bind('keyup', 'pagedown', nextSlide);

    $doc.bind('keyup', 'up', prevSlide);
    $doc.bind('keyup', 'pageup', prevSlide);
    $doc.bind('keyup', 'left', prevSlide);

}());