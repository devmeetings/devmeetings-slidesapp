define(['slider/slider.plugins'], function(sliderPlugins) {
    sliderPlugins.registerPlugin('slide', 'name', 'slide-name', 20000).directive('slideName', [

        function() {
            return {
                restrict: 'E',
                replace: true,
                scope: {
                    name: '=data',
                    slide: '=context'
                },
                template: '<div><h3 contenteditable ng-if="$root.modes.isEditMode" ng-model="slide.name"></h3></div>'
            };
        }
    ]);

});