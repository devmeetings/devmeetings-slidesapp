define(['module', 'slider/slider.plugins', 'services/MicrotasksCounter'], function(module, sliderPlugins, MicrotasksCounter) {
    var path = sliderPlugins.extractPath(module);

    sliderPlugins.registerPlugin('slide', 'counter', 'slide-microtasks-counter' ).directive('slideMicrotasksCounter', ['MicrotasksCounter',
        function( MicrotasksCounter ) {
            return {
                restrict: 'E',
                scope: {
                    data: '=data',
                    slide: '=context'
                },
                templateUrl: path + '/slide-microtasks-counter.html',
                link: function (scope, element) {
                    MicrotasksCounter.listen( function (data) {
                        
                    });

                    var task = {
                        hash: 1231
                    };

                    MicrotasksCounter.watch( task );

                    MicrotasksCounter.markTaskAsDone( task ); 
                }
            };
        }
    ]);

});
