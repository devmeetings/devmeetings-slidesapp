/* jshint esnext:true,-W097 */
'use strict';


import sliderPlugins from 'slider/slider.plugins';
import * as _ from '_';

class SwOutputErrors {

  constructor(data) {
    _.extend(this, data);
  }

  controller(vm) {
  }

}


sliderPlugins.directive('swOutputErrors', () => {

  return {
    restrict: 'E',
    replace: true,
    scope: {
    },
    bindToController: true,
    controllerAs: 'vm',
    templateUrl: '/static/dm-plugins/slide-workspace/output/sw-output-errors/sw-output-errors.html',
    controller($scope) {
      let output = new SwOutputErrors({
      });

      output.controller(this);
    }
  };

});
