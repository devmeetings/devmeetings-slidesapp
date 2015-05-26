/* jshint esnext:true,-W097 */
'use strict';


import sliderPlugins from 'slide/slider.plugins';
import * as module from 'module';
import * as _ from '_';


class OutputConsole {

  constructor(data) {
    _.extend(this, data);
  }

}

var path = sliderPlugins.extractPath(module);

sliderPlugins.directive('swOutputConsole', () => {

  return {
    restrict: 'E',
    scope: {
    },
    templateUrl: path + '/sw-output-console.html',
    link: function(scope, element) {
      let frame = new OutputConsole();
    }
  };

});
