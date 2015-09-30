/* globals define */
define(['slider/slider.plugins'], function (sliderPlugins) {
  sliderPlugins.registerPlugin('slide', 'text', 'slide-text', {
    order: 2,
    name: 'Text',
    description: 'Displays particular text (html) on the slide',
    example: {
      meta: 'string',
      data: '<h1>Hello World!</h1>'
    }
  }).directive('slideText', [

    function () {
      return {
        restrict: 'E',
        replace: true,
        scope: {
          text: '=data',
          slide: '=context'
        },
        template: '<div class="slide-text"><div ng-bind-html="slide.text"></div><textarea ng-if="$root.modes.isEditMode" ng-model="slide.text" rows="10" style="width: 100%"></textarea></div>'
      };
    }
  ]);
});
