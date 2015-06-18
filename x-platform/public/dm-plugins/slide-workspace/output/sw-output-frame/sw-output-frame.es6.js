/* jshint esnext:true,-W097 */
'use strict';


import sliderPlugins from 'slider/slider.plugins';
import * as _ from '_';



class OutputFrame {

  constructor(data) {
    _.extend(this, data);
    this.iframe1 = this.$element.find('iframe.num-one');
    this.iframe2 = this.$element.find('iframe.num-two');
    this.progressBar = this.$element.find('.progress-bar');

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

  setAddressWithFramesAnimation(url) {

    this.iframe2.attr('src', url);
    this.iframe1.css({'z-index': '10'});
    this.iframe2.css({'z-index': '5'});

    this.iframe1.fadeIn(1);
    this.iframe2.fadeOut(1);

    this.scope.percentOfProgress = 90;
    
    var currentFrame = this.iframe2;
    var loaded = this.iframe2.one('load', () => {
      if (currentFrame !== this.iframe2) {
        return;
      }
      this.iframe2.css({'z-index': '10'});
      this.iframe1.css({'z-index': '5'});

      this.iframe2.fadeIn(1);
      this.iframe1.fadeOut(1);
      
      var temporaryIframe1 = this.iframe1;
      this.iframe1 = this.iframe2;
      this.iframe2 = temporaryIframe1;

      this.scope.$apply(()=>{
        this.scope.percentOfProgress = 0;
      });
    });

  }

  setAddressWithoutFramesAnimation(url) {
    this.iframe1.attr('src', url);
  }

  setAddressAndAnimateIfNeeded(url) {

    var animationOn = this.$rootScope.performance.indexOf('workspace_output_noanim') === -1;

    if ( animationOn ) {
      this.setAddressWithFramesAnimation(url);
    } else {
      this.setAddressWithoutFramesAnimation(url);
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
        frame.setAddress(url);

      });
      
    }

  };

});
