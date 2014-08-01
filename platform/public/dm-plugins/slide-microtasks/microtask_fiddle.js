define(['_', 'utils/Plugins', './evalAssertion'], function(_, Plugins, evalAssertion) {
    'use strict';

    var EXECUTION_DELAY = 300;

    Plugins.registerPlugin('microtask.runner', 'fiddle', function(taskData, registerPlugin, listenPlugin, markTaskCompleted) {
        var task = taskData.task;

        listenPlugin('slide.slide-fiddle.output', _.throttle(function(innerDocument) {
            if (task.completed) {
                return;
            }
            var exists = function(selector, noOfChildren) {
                var $els = innerDocument.querySelectorAll(selector);
                if (noOfChildren) {
                    return $els.length === noOfChildren;
                }
                return $els.length > 0;
            };

            var result = evalAssertion(task.fiddle, ["document", 'exists'], [innerDocument, exists]);

            if (result) {
                markTaskCompleted();
            }
        }, EXECUTION_DELAY));

    });
});