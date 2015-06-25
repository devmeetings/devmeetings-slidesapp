/* jshint esnext:true,-W097 */
'use strict';

import sliderPlugins from 'slider/slider.plugins';
import viewTemplate from './sw-output-phone.html!text';

sliderPlugins.directive('swOutputPhone', () => {

  return {
    restrict: 'E',
    scope: {
      withPhone: '='
    },
    transclude: true,
    bindToController: true,
    controllerAs: 'model',
    template: viewTemplate,
    controller() {}
  };

});
