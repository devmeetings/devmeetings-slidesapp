define(['module', 'slider/slider.plugins'], function(module, sliderPlugins) {

    var path = sliderPlugins.extractPath(module);
    
    sliderPlugins.registerPlugin('slide', 'events', 'slide-events').directive('slideEvents', [

        function() {
            return {
                restrict: 'E',
                scope: {
                    events: '=data',
                    slide: '=context'
                },
                template: '<div ng-repeat="ev in events"> <slide-event event="ev"></slide-event> </div>'
            };
        }
    ]);

    sliderPlugins.directive('slideEvent', [

        function() {
            return {
                restrict: 'E',
                scope: {
                    event: '=event',
                },
                templateUrl: path + '/slide-event.html'
            };
        }
    ]);

});