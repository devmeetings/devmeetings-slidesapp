/* jshint esnext:true,-W097 */
'use strict';

import sliderPlugins from 'slider/slider.plugins';
import _ from '_';
import throttle from '../../throttle.es6';
import debounce from '../../debounce';
import viewTemplate from './sw-output-frame.html!text';

class OutputFrame {

  constructor (data) {
    _.extend(this, data);
    this.iframe1 = this.$element.find('iframe.num-one');
    this.iframe2 = this.$element.find('iframe.num-two');
    this.progressBar = this.$element.find('.progress-bar');
    this.scope.activeFrame = 0;

    var setAddressThrottled = throttle(this.scope, (url) => {
      this.setAddress(url);
    }, 15000);

    var setAddressDebounced = debounce(this.scope, (url) => {
      this.setAddress(url);
    }, 1500);

    this.setAddressLater = (url) => {
      setAddressThrottled(url);
      setAddressDebounced(url);
    };
  }

  isHttp (url) {
    return url.indexOf('http://') > -1;
  }

  isCurrentPageHttps () {
    return this.$location.protocol() === 'https';
  }

  setIsWarning (url) {
    if (this.isHttp(url) && this.isCurrentPageHttps()) {
      this.scope.isHttpsWarning = true;
      return;
    }
    this.scope.isHttpsWarning = false;
  }

  setAddressWithFramesAnimation (url) {
    this.$window.localStorage.wasLastFrameInactive = true;

    this.iframe2.attr('src', url);

    this.scope.percentOfProgress = 90;

    var currentFrame = this.iframe2;

    var swapFrames = () => {
      var temporaryIframe1 = this.iframe1;
      this.iframe1 = this.iframe2;
      this.iframe2 = temporaryIframe1;

      this.scope.$apply(() => {
        let scope = this.scope;
        scope.activeFrame = (scope.activeFrame + 1) % 2;
        scope.percentOfProgress = 0;
        this.$window.localStorage.wasLastFrameInactive = false;
      });
    };

    var timeoutPromise = this.$timeout(() => {
      if (currentFrame !== this.iframe2) {
        return;
      }
      currentFrame[0].contentWindow.stop();
      swapFrames();
    }, 5000);

    this.iframe2.one('load', () => {
      if (currentFrame !== this.iframe2) {
        return;
      }
      this.$timeout.cancel(timeoutPromise);
      swapFrames();
    });
  }

  setAddressWithoutFramesAnimation (url) {
    this.iframe1.attr('src', url);
  }

  setAddressAndAnimateIfNeeded (url) {
    var animationOn = this.$rootScope.performance.indexOf('workspace_output_noanim') === -1;

    if (animationOn) {
      this.setAddressWithFramesAnimation(url);
    } else {
      this.setAddressWithoutFramesAnimation(url);
    }
  }

  setAddress (url) {
    if (this.scope.isHangWarning) {
      this.scope.lastKnownUrl = url;
      return;
    }

    this.setIsWarning(url);
    this.setAddressAndAnimateIfNeeded(url);
  }

  setHangWarning () {
    if (this.$window.localStorage.wasLastFrameInactive === 'true') {
      this.scope.isHangWarning = true;
      return;
    }
    this.disableHangWarning();
  }

  disableHangWarning () {
    this.scope.isHangWarning = false;
    if (this.scope.lastKnownUrl) {
      this.setAddress(this.scope.lastKnownUrl);
    }
  }

}

sliderPlugins.directive('swOutputFrame', ($rootScope, $location, $timeout, $window) => {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      baseUrl: '=',
      currentUrl: '=',
      isDead: '='
    },
    template: viewTemplate,
    link: function (scope, element) {
      let frame = new OutputFrame({
        $element: element, $location, scope, $rootScope, $timeout, $window
      });

      frame.setHangWarning();

      scope.disableHangWarning = () => {
        frame.disableHangWarning();
      };

      scope.$watch('currentUrl', (url) => {
        if (!url) {
          return;
        }
        frame.setAddressLater(url);
      });
    }
  };
});
