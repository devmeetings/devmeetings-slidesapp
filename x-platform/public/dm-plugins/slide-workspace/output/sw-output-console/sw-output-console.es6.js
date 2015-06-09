/* jshint esnext:true,-W097 */
'use strict';


import sliderPlugins from 'slider/slider.plugins';
import * as require from 'require';
import * as _ from '_';


class OutputConsole {

  constructor(data) {
    _.extend(this, data);
  }

}


sliderPlugins.directive('swOutputConsole', () => {

  return {
    restrict: 'E',
    templateUrl: require.toUrl('./sw-output-console.html'),
    link: function(scope, element) {
      let frame = new OutputConsole();
    }
  };

});
