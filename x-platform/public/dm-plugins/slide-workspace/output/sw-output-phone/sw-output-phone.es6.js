/* jshint esnext:true,-W097 */
'use strict';


import sliderPlugins from 'slider/slider.plugins';


sliderPlugins.directive('swOutputPhone', () => {

  return {
    restrict: 'E',
    scope: {
      withPhone: '='
    },
    transclude: true,
    bindToController: true,
    controllerAs: 'model',
    templateUrl: '/static/dm-plugins/slide-workspace/output/sw-output-phone/sw-output-phone.html',
    controller() {}
  };

});
