/* jshint esnext:true,-W097 */
'use strict';

import sliderPlugins from 'slider/slider.plugins';
import _ from '_';
import viewTemplate from './sw-output-console.html!text';

class OutputConsole {

  constructor (data) {
    _.extend(this, data);
  }

}

sliderPlugins.directive('swOutputConsole', () => {

  return {
    restrict: 'E',
    template: viewTemplate,
    link: function (scope, element) {
      let frame = new OutputConsole();
    }
  };

});
