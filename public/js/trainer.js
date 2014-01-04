(function(){
    'use strict';

    var SolutionButton = (function(){
        var $el = $('.task-solution-btn');
        var taskData = null;
        var parentFrame = null;

        var Btn = {
            show: function(show) {
                $el.toggleClass('hidden', show);
            },
            reset: function(newTaskData, newParentFrame) {
                taskData = newTaskData;
                parentFrame = newParentFrame;
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

    window.addEventListener('message', function(ev){
        var data = ev.data;
        if (data.type !== 'slideupdate') {
            return;
        }

        editor.setValue(data.currentSlide.notes);
        SolutionButton.show(data.currentSlide.task);
        SolutionButton.reset(data.currentSlide.task, ev.source);
        console.log(ev);

        iframe.src =  '/slide?slide='+encodeURIComponent(JSON.stringify(data.nextSlide));
    });
}());