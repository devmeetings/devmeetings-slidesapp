define(['_', 'utils/Plugins', './evalAssertion'], function(_, Plugins, evalAssertion) {
    'use strict';

    var EXECUTION_DELAY = 300;

    Plugins.registerPlugin('microtask.runner', 'jsonOutput', function(taskData, registerPlugin, listenPlugin, markTaskCompleted) {
        var task = taskData.task;

        listenPlugin('slide.jsonOutput.display', _.debounce(function(obj) {
            if (task.completed) {
                return;
            }



            var result = evalAssertion(task.jsonOutput, ["x", "equals"], [obj, _.isEqual]);

            if (result) {
                markTaskCompleted();
            }
        }, EXECUTION_DELAY));

    });
});
