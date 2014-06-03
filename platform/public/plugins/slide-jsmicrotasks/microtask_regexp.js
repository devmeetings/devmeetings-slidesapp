define(['_', 'utils/Plugins'], function(_, Plugins) {
    'use strict';

    var EXECUTION_DELAY = 500;

    _.forEach(['css', 'html', 'js'], function (trigger) {
        Plugins.registerPlugin('microtasks', trigger, function (task, registerPlugin, listenPlugin, markTaskCompleted) {
            listenPlugin('slide.slide-fiddle.change', _.debounce( function(fiddle) {
                if (task.completed) {
                    return;
                }
                var result = new RegExp(task[trigger].trim(), 'im').test(fiddle[trigger]);
                if (result) {
                    markTaskCompleted(); 
                }
            }, EXECUTION_DELAY));
        });
    });
});
