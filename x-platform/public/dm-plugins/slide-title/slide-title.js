/* globals define */
define(['slider/slider.plugins'], function (sliderPlugins) {
  sliderPlugins.registerPlugin('slide', 'title', 'slide-title', {
    order: 1,
    name: 'Title',
    description: 'Slide Title',
    example: {
      meta: 'string',
      data: 'My First Slide'
    }
  }).directive('slideTitle', [

    function () {
      return {
        restrict: 'E',
        replace: true,
        scope: {
          title: '=data',
          slide: '=context'
        },
        template: '<div class="slide-title"><h1 ng-if="!$root.modes.isEditMode" ng-bind-html="slide.title"></h1><h1 ng-if="$root.modes.isEditMode" contenteditable ng-model="slide.title"></h1></div>'
      };
    }
  ]);
});
