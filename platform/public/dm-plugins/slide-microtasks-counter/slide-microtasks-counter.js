define(['module', '_', 'slider/slider.plugins', 'services/MicrotasksCounter'], function(module, _, sliderPlugins, MicrotasksCounter) {
    var path = sliderPlugins.extractPath(module);

    sliderPlugins.registerPlugin('microtask', '*', 'slide-microtasks-counter').directive('slideMicrotasksCounter', ['MicrotasksCounter',
        function(MicrotasksCounter) {
            return {
                restrict: 'E',
                scope: {
                    taskMeta: '=context'
                },
                templateUrl: path + '/slide-microtasks-counter.html',
                link: function(scope, element) {
                    scope.taskInfo = {
                        total: 0,
                        solved: 0
                    };

                    MicrotasksCounter.listen(scope.taskMeta.hash, function(taskInfo) {
                        scope.$apply(function() {
                            scope.taskInfo = taskInfo;
                        });
                    });

                    scope.$watch('taskMeta.completed', function(completed) {
                        if (completed) {
                            MicrotasksCounter.markTaskAsDone(scope.taskMeta.hash);
                        }
                    });
                }
            };
        }
    ]);

});