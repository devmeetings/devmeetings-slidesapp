define(['module', '_', 'slider/slider.plugins', 'services/MicrotasksCounter'], function(module, _, sliderPlugins, MicrotasksCounter) {
    var path = sliderPlugins.extractPath(module);

    sliderPlugins.registerPlugin('microtask', '*', 'slide-microtasks-counter' ).directive('slideMicrotasksCounter', ['MicrotasksCounter',
        function( MicrotasksCounter ) {
            return {
                restrict: 'E',
                scope: {
                    task: '=context'
                },
                templateUrl: path + '/slide-microtasks-counter.html',
                link: function (scope, element) {
                    scope.taskInfo = {
                        total: 0,
                        solved: 0
                    };

                    MicrotasksCounter.listen( function (data) {
                        var taskInfo =_.find(data, function (object) {
                            return object.task === scope.task.hash;
                        });
                        if (taskInfo) {
                            scope.$apply( function () {
                                scope.taskInfo = taskInfo;
                            });
                        }
                    });
                    
                    MicrotasksCounter.watch( scope.task );

                    scope.$watch('task.completed', function (completed) {
                        if (completed) {
                            MicrotasksCounter.markTaskAsDone(scope.task); 
                        }
                    });
                }
            };
        }
    ]);

});
