define(['slider/slider.plugins'], function(sliderPlugins) {
    sliderPlugins.factory('User', ['Sockets',
        function(Sockets) {
            var userData,
                callback = function(data) {
                    console.log('suerdata', data);
                };

            return {
                getUserData: function() {
                    if (!userData) {
                        Sockets.emit('getUserData');
                        Sockets.on('userData', function(data) {
                            callback(data);
                        });
                    } else {
                        callback(userData);
                    }
                },
                setCallback: function(callbackFn) {
                    callback = callbackFn;
                }
            };
        }
    ]);
});