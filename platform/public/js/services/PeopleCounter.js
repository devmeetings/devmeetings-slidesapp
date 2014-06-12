define(['slider/slider.plugins', 'services/Sockets'], function(sliderPlugins, Sockets) {
    sliderPlugins.factory('PeopleCounter', ['Sockets',
        function(Sockets) {

            var PeopleCounter = {
                count: 0     
            };
            
            Sockets.on('people.counter', function(data) {
                PeopleCounter.count = data.peopleCount;  
            });

            return PeopleCounter;
            
        }
    ]);
});
