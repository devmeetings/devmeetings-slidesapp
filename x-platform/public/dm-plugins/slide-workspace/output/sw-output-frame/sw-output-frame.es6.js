/* jshint esnext:true,-W097 */
'use strict';


import sliderPlugins from 'slider/slider.plugins';
import * as module from 'module';
import * as _ from '_';

class UrlsData {

  constructor(data) {
    _.extend(this, data);
    this.url = '';
    this.urls = [];
    this.iframe_one = this.$element.find('iframe.num-one');
    this.iframe_two = this.$element.find('iframe.num-two');
  }

  makeNewUrl(url) {
    this.url = url;
    this.urls.unshift(this.url);
  }
}



class OutputFrame {

  constructor(data) {
    _.extend(this, data);
    this.setAddress_was_called = 0;
    this.iframe_one;
    this.iframe_two;
  }

  isHttp(url) {
    return url.indexOf('http://') > -1;
  }
  isCurrentPageHttps() {
    return this.$location.protocol() === 'https';
  }

  refresh() {

    //this.iframe_one = this.$element.find('iframe.num-one');
    //this.iframe_two = this.$element.find('iframe.num-two');

    this.$interval( () => {

      //this.iframe_one = $("#iframeNum-1");
      //this.iframe_two = $("#iframeNum-2");
      //this.iframe_one = this.$element.find('iframe.num-one');
      //this.iframe_two = this.$element.find('iframe.num-two');

      //this.urls.unshift(urlsData.url);
      //this.urls.slice(0, 2);
      
      //var iframe_one = this.$element.find('iframe.num-one');
      //var iframe_two = this.$element.find('iframe.num-two');
      //console.log(iframe_one);
      //console.log(iframe_two);

      // console??
      console.log(urlsData.urls[0]);
      console.log(urlsData.iframe_one[0]);
      console.log(urlsData.iframe_two[0]);

      //urlsData.iframe_one.css({'z-index':'1'});
      //urlsData.iframe_two.css({'z-index':'2'});
      // PROBLEM : nie widzi selektora iframe'a, nie wstawia src
      // ODKOMENTOWAC do animacji
      urlsData.iframe_one.attr('src', urlsData.url);
      //urlsData.iframe_two.animate({'opacity':'0'}, 500);
      urlsData.iframe_two.attr('src', urlsData.url);
      // testowe ponizej
      //urlsData.iframe_two.css({'width': '100px !important'});

      /*this.$timeout( () => {
        urlsData.iframe_two.attr('src', urlsData.urls[0]);
      }, 200);

      this.$timeout( () => {
        urlsData.iframe_two.css({'opacity':'1'});
        urlsData.iframe_two.css({'z-index':'1'});
        urlsData.iframe_one.css({'z-index':'2'});
        urlsData.iframe_two.attr('src', urlsData.urls[0]);
      }, 500);*/

    }, 1000);

  }

  setAddress(url) {

    if ( this.setAddress_was_called <= 2) {
      this.setAddress_was_called += 1;
      console.log(this.setAddress_was_called);
      this.iframe_one = this.$element.find('iframe.num-one');
      this.iframe_two = this.$element.find('iframe.num-two');
    }
    //this.iframe_one = this.$element.find('iframe.num-one');
    //this.iframe_two = this.$element.find('iframe.num-two');
    console.log(this.iframe_one);
    console.log(this.iframe_two);

    /*
    this.urls.unshift(url);
    //this.urls.slice(0, 2);
    console.log(this.urls);
    */

    if (this.isHttp(url) && this.isCurrentPageHttps()) {
      this.scope.isWarning = true;
      return;
    }
    this.scope.isWarning = false;

    this.iframe_two.attr('src', url);
    this.iframe_one.css({'z-index': '10'});
    this.iframe_two.css({'z-index': '5'});
    //this.iframe_one.addClass('fadeOut');

    this.iframe_two.fadeOut();

    var loaded = this.iframe_two.one('load', () => {
      console.log('loaded!');
      this.iframe_two.css({'z-index': '10'});
      this.iframe_one.css({'z-index': '5'});
      this.iframe_two.fadeIn('slow');
      
      this.temporary_iframe_one = this.iframe_one;
      this.temporary_iframe_two = this.iframe_two;
      this.iframe_one = this.temporary_iframe_two;
      this.iframe_two = this.temporary_iframe_one;
      //this.iframe_two.attr('src', url);
      //this.iframe_one.removeClass('fadeOut');
      //this.iframe_one.addClass('opacity_1');

      //this.iframe_two.addClass('opacity_0');
      //this.iframe_two.addClass('fadeIn');

      
      

      console.log(this.iframe_one);
      console.log(this.iframe_two);
    });
    
    /*
    this.iframe_one.css({'z-index':'1'});
    this.iframe_two.css({'z-index':'2'});
    this.iframe_one.attr('src', this.urls[0]);
    this.iframe_two.animate({'opacity':'0'}, 500);
    //this.iframe_two.attr('src', this.urls[0]);

    this.$timeout( () => {
      this.iframe_two.attr('src', this.urls[0]);
    }, 200);

    this.$timeout( () => {
      this.iframe_two.css({'opacity':'1'});
      this.iframe_two.css({'z-index':'1'});
      this.iframe_one.css({'z-index':'2'});
      //this.iframe_two.attr('src', this.urls[0]);
    }, 500);*/

  }

}

var path = sliderPlugins.extractPath(module);
//var urlsData;


sliderPlugins.directive('swOutputFrame', ($location, $timeout, $interval) => {

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
        $element: element, $location, $timeout, $interval, scope
      });
      //urlsData = new UrlsData({
        //$element: element, $location, $timeout, $interval, scope
      //});

      scope.$watch('currentUrl', (url) => {
        if (!url) {
          return;
        }
        //urlsData.makeNewUrl(url);
        frame.setAddress(url);
        //frame.refresh(url);
      });
      //frame.refresh();
    }
  };

});
