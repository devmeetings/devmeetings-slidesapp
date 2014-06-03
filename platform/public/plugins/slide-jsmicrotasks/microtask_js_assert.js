define(['_','utils/Plugins'], function(_, Plugins) {
    'use strict';

    Plugins.registerPlugin('microtasks', 'js_assert', function (task, regFunction, listenFunction, markTaskCompleted){
        regFunction('slide.slide-jsrunner', 'process', {
            monitor: task.monitor,
            name: task.hash
        });

        listenFunction('slide.slide-jsrunner.' + task.hash, function(x) {
            if (task.completed) {
                return;
            }

            var toEval = [
                '(function(' + task.monitor + '){',
                task.js_assert,
                '}(x))'
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
