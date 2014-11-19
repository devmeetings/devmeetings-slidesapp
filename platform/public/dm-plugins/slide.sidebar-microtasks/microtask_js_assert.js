define(['_', 'utils/Plugins', './evalAssertion'], function(_, Plugins, evalAssertion) {
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


            var result = evalAssertion(task.js_assert, monitor, args);

            if (result) {
                markTaskCompleted();
            }
        });
    });
});
