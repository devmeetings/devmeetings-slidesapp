define(['slider/slider.plugins', 'services/Sockets'], function(sliderPlugins, Sockets) {
    sliderPlugins.factory('User', ['Sockets', '$rootScope', '$q',
        function(Sockets, $rootScope, $q) {
            var userData;

            return {
                getUserData: function(callback) {  // deprecated
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
                },
                currentUser: function() {
                    var result = $q.defer();
                    if (userData) {
                        result.resolve(userData);
                        return result.promise;
                    }

                    Sockets.emit('getUserData');
                    Sockets.on('userData', function (data) {
                        userData = data;
                        result.resolve(userData);
                    });

                    return result.promise;
                }
            };
        }
    ]);
});
