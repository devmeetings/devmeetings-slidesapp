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
                template: '<div><div ng-if="!$root.modes.isEditMode" ng-bind-html="slide.text"></div><div ng-if="$root.modes.isEditMode" contenteditable ng-model="slide.text"></div></div>'
            };
        }
    ]);

});