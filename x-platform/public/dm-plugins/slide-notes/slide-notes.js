define(['module', 'slider/slider.plugins', './slide-notes.html!text'], function (module, sliderPlugins, viewTemplate) {
  'use strict';

  sliderPlugins.registerPlugin('slide.sidebar', 'notes', 'slide-notes', {
    order: 3800,
    name: 'Notes',
    description: 'Notes written in markdown.',
    example: {
      meta: 'string',
      data: 'This are my `notes`\n'
    }
  }).directive('slideNotes', [
    function () {
      return {
        restrict: 'E',
        replace: true,
        scope: {
          notes: '=data',
          slide: '=context',
          mode: '='
        },
        template: viewTemplate
      };
    }
  ]);

});
