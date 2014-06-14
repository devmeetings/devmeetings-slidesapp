define(['slider/slider.plugins', 'services/Sockets', 'services/DeckAndSlides'], function(sliderPlugins, Sockets, DeckAndSlides) {
    sliderPlugins.factory('MicrotasksCounter', ['Sockets', 'DeckAndSlides',
        function(Sockets, DeckAndSlides) {
            
            var MicrotasksCounter = {
                markTaskAsDone: function( task ) {
                    Sockets.emit('microtasks.counter.done', {
                        slideId: DeckAndSlides.slideId,
                        taskHash: task.hash 
                    });
                },
                watch: function( task ) {
                    Sockets.emit('microtasks.counter.watch', {
                        slideId: DeckAndSlides.slideId,
                        taskHash: task.hash
                    });
                }, 
                listen: function(task, callback ) {
                    Sockets.on('microtasks.counter.notify' + task.hash, callback);
                }
            };


            return MicrotasksCounter;
        }
    ]);
});
