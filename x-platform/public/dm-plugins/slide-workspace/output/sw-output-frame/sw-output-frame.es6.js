/* jshint esnext:true,-W097 */
'use strict';


import sliderPlugins from 'slider/slider.plugins';
import * as _ from '_';


class OutputFrame {

  constructor(data) {
    _.extend(this, data);
  }

  isHttp(url) {
    return url.indexOf('http://') > -1;
  }
  isCurrentPageHttps() {
    return this.$location.protocol() === 'https';
  }

  setAddress(url) {
    if (this.isHttp(url) && this.isCurrentPageHttps()) {
      this.scope.isWarning = true;
      return;
    }
    this.scope.isWarning = false;
    this.$element.find('iframe').attr('src', url);
  }

}


sliderPlugins.directive('swOutputFrame', ($location) => {

  return {
    restrict: 'E',
    replace: true,
    scope: {
      baseUrl: '=',
      currentUrl: '=',
      isDead: '='
    },
    templateUrl: '/static/dm-plugins/slide-workspace/output/sw-output-frame/sw-output-frame.html',
    link: function(scope, element) {
      let frame = new OutputFrame({
        $element: element, $location,
        scope
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
