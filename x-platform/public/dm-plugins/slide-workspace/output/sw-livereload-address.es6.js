/* jshint esnext:true,-W097 */
'use strict';

import sliderPlugins from 'slider/slider.plugins';


class SwLivereloadAddress {

  constructor($window) {
    this.$window = $window;
  }

  getAddress(wsId, currentPath) {
    return '/api/workspace/page/' + wsId + currentPath;
  }

  getFullAddress(wsId, currentPath) {
    var loc = this.$window.location;
    var address = this.getAddress(wsId, currentPath);
    return loc.protocol + '//' + loc.host + address;
  }

}

sliderPlugins.service('swLivereloadAddress', SwLivereloadAddress);
