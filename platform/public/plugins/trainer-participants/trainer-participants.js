define(['slider/slider.plugins'], function(sliderPlugins) {
    sliderPlugins.registerPlugin('trainer', '*', 'trainer-participants', 1).directive('trainerParticipants', [
        'Sockets',
        function(Sockets) {
            return {
                restrict: 'E',
                scope: {
                    notes: '=data',
                    slide: '=context'
                },
                template: '<div><h1>Hello World</h1><ul><li ng-repeat="id in ids">{{ id }}</li></ul></div>',
                link: function(scope) {
                    Sockets.emit('trainer.participants.get', {}, function(data) {
                        scope.$apply(function() {
                            scope.ids = data;
                        });
                    });
                }
            };
        }
    ]);
});