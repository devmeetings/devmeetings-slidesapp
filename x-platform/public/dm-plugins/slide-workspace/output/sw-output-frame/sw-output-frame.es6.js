/* jshint esnext:true,-W097 */
'use strict';


import sliderPlugins from 'slider/slider.plugins';
import * as _ from '_';



class OutputFrame {

  constructor(data) {
    _.extend(this, data);
    this.setAddress_was_called = 0;
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

  setAddress(url) {

    this.setIsWarning(url);

    this.progress_bar = this.$element.find('.progress-bar');

    if ( this.setAddress_was_called <= 2) {
      //it should be as above 
      this.setAddress_was_called += 1;
      this.iframe_one = this.$element.find('iframe.num-one');
      this.iframe_two = this.$element.find('iframe.num-two');
    }

    this.iframe_two.attr('src', url);
    this.iframe_one.css({'z-index': '10'});
    this.iframe_two.css({'z-index': '5'});

    this.iframe_one.fadeIn(1);
    this.iframe_two.fadeOut(1);

    this.scope.percent_of_progress = 90;
    
    var currentFrame = this.iframe_two;
    var loaded = this.iframe_two.one('load', () => {
      if (currentFrame !== this.iframe_two) {
        return;
      }
      this.iframe_two.css({'z-index': '10'});
      this.iframe_one.css({'z-index': '5'});

      this.iframe_two.fadeIn(1);
      this.iframe_one.fadeOut(1);
      
      var temp_one = this.iframe_one;
      this.iframe_one = this.iframe_two;
      this.iframe_two = temp_one;

      this.scope.$apply(()=>{
        this.scope.percent_of_progress = 0;
      });
    });

  }

}



sliderPlugins.directive('swOutputFrame', ( $location, $timeout, $interval) => {

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
        $element: element, $location, $timeout, $interval, scope
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
