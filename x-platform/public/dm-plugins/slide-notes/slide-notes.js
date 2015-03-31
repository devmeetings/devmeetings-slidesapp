define(['module',  'slider/slider.plugins'], function(module, sliderPlugins) {
  'use strict';

  var path = sliderPlugins.extractPath(module);

  sliderPlugins.registerPlugin('slide.sidebar', 'notes', 'slide-notes', 3800).directive('slideNotes', [
    function() {
      return {
        restrict: 'E',
        replace: true,
        scope: {
          notes: '=data',
          slide: '=context',
          mode: '='
        },
        templateUrl: path + '/slide-notes.jade',
      };
    }
  ]);

});
