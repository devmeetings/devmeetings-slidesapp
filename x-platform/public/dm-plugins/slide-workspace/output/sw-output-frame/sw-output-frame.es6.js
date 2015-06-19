/* jshint esnext:true,-W097 */
'use strict';


import sliderPlugins from 'slider/slider.plugins';
import * as _ from '_';
import throttle from 'es6!../../throttle.es6';



class OutputFrame {

  constructor(data) {
    _.extend(this, data);
    this.iframe1 = this.$element.find('iframe.num-one');
    this.iframe2 = this.$element.find('iframe.num-two');
    this.progressBar = this.$element.find('.progress-bar');
    this.scope.activeFrame = 0;

    this.setAddressLater = throttle(this.scope, (url)=>{
      this.setAddress(url);
    }, 1000);
  }

  isHttp(url) {
    return url.indexOf('http://') > -1;
  }

  isCurrentPageHttps() {
    return this.$location.protocol() === 'https';
  }

  setIsWarning(url) {
    if (this.isHttp(url) && this.isCurrentPageHttps()) {
      this.scope.isWarning = true;
      return;
    }
    this.scope.isWarning = false;
  }

  setAdressWithFramesAnimation(url) {

    this.iframe2.attr('src', url);

    this.scope.percentOfProgress = 90;
    
    var currentFrame = this.iframe2;

    this.iframe2.one('load', () => {
      if (currentFrame !== this.iframe2) {
        return;
      }

      var temporaryIframe1 = this.iframe1;
      this.iframe1 = this.iframe2;
      this.iframe2 = temporaryIframe1;
    
      this.scope.$apply(()=>{
        let scope = this.scope;
        scope.activeFrame = (scope.activeFrame + 1) % 2;
        scope.percentOfProgress = 0;
      });
    });

  }

  setAdressWithoutFramesAnimation(url) {
    this.iframe1.attr('src', url);
  }

  setAddressAndAnimateIfNeeded(url) {

    var animationOn = this.$rootScope.performance.indexOf('workspace_output_noanim') === -1;

    if ( animationOn ) {
      this.setAdressWithFramesAnimation(url);
    } else {
      this.setAdressWithoutFramesAnimation(url);
    }
  }

  setAddress(url) {

    this.setIsWarning(url);
    this.setAddressAndAnimateIfNeeded(url);

  }

}



sliderPlugins.directive('swOutputFrame', ( $rootScope, $location ) => {

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
        $element: element, $location, scope, $rootScope
      });

      scope.$watch('currentUrl', (url) => {
        if (!url) {
          return;
        }
        frame.setAddressLater(url);
      });
      
    }

  };

});
