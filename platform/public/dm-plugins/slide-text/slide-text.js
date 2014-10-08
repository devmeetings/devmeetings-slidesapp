define(['slider/slider.plugins'], function(sliderPlugins) {
    sliderPlugins.registerPlugin('slide', 'text', 'slide-text', 2).directive('slideText', [

        function() {
            return {
                restrict: 'E',
                replace: true,
                scope: {
                    text: '=data',
                    slide: '=context'
                },
                template: '<div><div ng-bind-html="slide.text"></div><textarea ng-if="$root.modes.isEditMode" ng-model="slide.text" rows="10" style="width: 100%"></textarea></div>'
            };
        }
    ]);

});