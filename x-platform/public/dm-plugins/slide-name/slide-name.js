define(['slider/slider.plugins'], function (sliderPlugins) {
  sliderPlugins.registerPlugin('slide', 'name', 'slide-name', {
    order: 60000,
    name: 'Slide Name',
    description: 'Slide Name displayed on Deck navbar',
    example: {
      meta: 'string',
      data: 'Slide Name'
    }
  }).directive('slideName', [

    function () {
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
