/* jshint esnext:true,-W097 */
'use strict';


import sliderPlugins from 'slider/slider.plugins';
import * as module from 'module';


var path = sliderPlugins.extractPath(module);

sliderPlugins.directive('swTools', () => {

  return {
    restrict: 'E',
    replace: true,
    scope: {},
    bindToController: true,
    controllerAs: 'model',
    templateUrl: path + '/sw-tools.html',
    controller: function() {}
  };

});
