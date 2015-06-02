/* jshint esnext:true,-W097 */
'use strict';


import sliderPlugins from 'slider/slider.plugins';
import * as module from 'module';
import * as _ from '_';


class OutputFrame {

  constructor(data) {
    _.extend(this, data);
  }

  setAddress(url) {
    this.$element.find('iframe').attr('src', url);
  }

}

var path = sliderPlugins.extractPath(module);

sliderPlugins.directive('swOutputFrame', () => {

  return {
    restrict: 'E',
    replace: true,
    scope: {
      baseUrl: '=',
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
        if (!url) {
          return;
        }
        frame.setAddress(url);
      });
    }
  };

});
