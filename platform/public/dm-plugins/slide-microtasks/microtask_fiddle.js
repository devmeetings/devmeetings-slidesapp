define(['_', 'utils/Plugins', './evalAssertion'], function(_, Plugins, evalAssertion) {
    'use strict';

    var EXECUTION_DELAY = 300;

    Plugins.registerPlugin('microtask.runner', 'fiddle', function(taskData, registerPlugin, listenPlugin, markTaskCompleted) {
        var task = taskData.task;

        listenPlugin('slide.slide-fiddle.output', _.throttle(function(innerDocument, innerWindow) {
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

            var contains = function(selector, text) {
                var $els = innerDocument.querySelectorAll(selector);
                var i;
                for (i=0;i<$els.length;++i) {
                    if ($els[i].innerHTML.search(test) !== -1) {
                        return true;
                    }
                }
                return false;
            };

            var verify = function() {

                var result = evalAssertion(task.fiddle, ['window', 'document', 'exists', 'contains'], [innerWindow, innerDocument, exists, contains]);
                if (result) {
                    markTaskCompleted();
                }
                return result;
            };

            var result = verify();
            if (!result) {
                // Try one more time after few seconds (maybe angular is still loading)
                setTimeout(verify, 1000);
            }
        }, EXECUTION_DELAY));

    });
});