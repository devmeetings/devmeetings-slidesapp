/* jshint esnext:true,-W097 */
'use strict';


import sliderPlugins from 'slide/slider.plugins';
import * as module from 'module';
import * as _ from '_';


class OutputFrame {

  constructor(data) {
    _.extend(this, data);
  }

  setAddress(url) {

  }

}

var path = sliderPlugins.extractPath(module);

sliderPlugins.directive('swOutputFrame', () => {

  return {
    restrict: 'E',
    scope: {
      currentUrl: '=',
      isDead: '=',
      withAddress: '='
    },
    templateUrl: path + '/sw-output-frame.html',
    link: function(scope, element) {
      let frame = new OutputFrame({
        $element: element
      });

      scope.$watch('currentUrl', (url) => {
        frame.setAddress(url);
      });
    }
  };

});
