/* jshint esnext:true,-W097 */
'use strict';

import sliderPlugins from 'slider/slider.plugins';
import viewTemplate from './sw-output-console.html!text';

sliderPlugins.directive('swOutputConsole', () => {

  return {
    restrict: 'E',
    template: viewTemplate
  };

});
