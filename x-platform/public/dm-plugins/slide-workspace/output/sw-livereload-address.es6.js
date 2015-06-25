/* jshint esnext:true,-W097 */
'use strict';

import sliderPlugins from 'slider/slider.plugins';

class SwLivereloadAddress {

  constructor ($window) {
    this.$window = $window;
  }

  getAddress (wsId, currentPath) {
    return '/api/workspace/page/' + wsId + currentPath;
  }

  getFullAddress (wsId, currentPath) {
    var address = this.getAddress(wsId, currentPath);
    return this.getHostAddress() + address;
  }

  getHostAddress () {
    var loc = this.$window.location;
    return loc.protocol + '//' + loc.host;
  }

}

sliderPlugins.service('swLivereloadAddress', SwLivereloadAddress);
