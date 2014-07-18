define(['slider/slider.plugins', 'services/Sockets'], function(sliderPlugins, Sockets) {
    sliderPlugins.factory('User', ['Sockets', '$rootScope',
        function(Sockets, $rootScope) {
            var userData;

            return {
                getUserData: function(callback) {
                    if (!userData) {
                        Sockets.emit('getUserData');
                        Sockets.on('userData', function(data) {
                            userData = data;
                            $rootScope.$apply( function () {
                                callback(data);
                            });
                        });
                    } else {
                        callback(userData);
                    }
                }
            };
        }
    ]);
});
