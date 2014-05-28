define(['slider/slider.plugins'], function(sliderPlugins) {
    sliderPlugins.registerPlugin('trainer', '*', 'trainer-participants', 1).directive('trainerParticipants', [
        'Sockets', '$rootScope',
        function(Sockets, $rootScope) {



            return {
                restrict: 'E',
                scope: {
                    notes: '=data',
                    slide: '=context'
                },
                template: '<div><h1>Hello World</h1><ul><li ng-repeat="user in users">{{ user.user.name }}</li></ul></div>',
                link: function(scope) {
                    Sockets.emit('trainer.register', {}, function(data) {
                        $rootScope.$apply(function() {
                            $rootScope.isAuthorized = data.isAuthorized;
                        });
                    });

                    Sockets.on('trainer.participants', function(data) {
                        scope.$apply(function() {
                            scope.users = data;
                        });
                    });
                }
            };
        }
    ]);
});