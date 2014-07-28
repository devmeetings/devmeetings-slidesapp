define(['slider/slider.plugins'], function(sliderPlugins) {
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
                template: '<div> {{ event | json }}</div>'
            };
        }
    ]);

});