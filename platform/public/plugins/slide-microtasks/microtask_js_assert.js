define(['_', 'utils/Plugins'], function(_, Plugins) {
    'use strict';

    Plugins.registerPlugin('microtask.runner', 'js_assert', function(taskData, registerPlugin, listenPlugin, markTaskCompleted) {

        var task = taskData.task;

        registerPlugin('slide.slide-jsrunner', 'process', {
            monitor: task.monitor,
            name: taskData.hash
        });

        listenPlugin('slide.slide-jsrunner.' + taskData.hash, function( /*args*/ ) {
            if (task.completed) {
                return;
            }

            var args = [].slice.call(arguments);
            var monitor = _.isArray(task.monitor) ? task.monitor : [task.monitor];

            var toEval = [
                '(function(' + monitor.join(',') + '){',
                task.js_assert,
                '}).apply(null, args)'
            ].join(';\n');

            /* jshint evil:true */
            var result = eval(toEval);
            /* jshint evil:false */

            if (result) {
                markTaskCompleted();
            }
        });
    });
});