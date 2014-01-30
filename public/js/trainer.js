(function() {
    'use strict';

    var parentFrame = null;

    var Solution = (function() {
        var $solutionSpace = $('.task-solution');
        var $notesSpace = $('.nextslide-space');

        var $el = $('.task-solution-btn');
        var $solution = $('iframe.task-solution-frame');
        var taskData = null;

        var Solution = {
            showButton: function(show) {
                $solutionSpace.toggleClass('hidden', !show);
                $notesSpace.toggleClass('col-md-6', !! show).toggleClass('col-md-12', !show);
            },
            reset: function(slideId, newTaskData) {
                taskData = newTaskData;
                if (taskData && taskData.solution) {
                    $solution[0].src = '/slides-' + parentFrame.presentation + ':' + slideId + '?solution';
                }
            },
            display: function() {
                parentFrame.postMessage({
                    type: 'tasksolution',
                    solution: taskData.solution
                }, window.location);
            }
        };

        $el.on('click', Solution.display.bind(Solution));

        return Solution;
    }());

    var editor = ace.edit("editor");
    editor.setTheme("ace/theme/monokai");
    editor.getSession().setMode("ace/mode/javascript");

    var iframe = $('iframe.next-slide')[0];

    window.addEventListener('message', function(ev) {
        var data = ev.data;
        if (data.type !== 'slideupdate') {
            return;
        }
        parentFrame = ev.source;

        editor.setValue(data.currentSlide.notes);
        Solution.showButton(data.currentSlide.task);
        Solution.reset(data.currentSlide.id, data.currentSlide.task);

        iframe.src = '/slides-' + parentFrame.presentation + ':' + (data.nextSlide ? data.nextSlide.id : "");
    });
    window.onbeforeunload = function() {
        return "Are you sure you want to exit?";
    };

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