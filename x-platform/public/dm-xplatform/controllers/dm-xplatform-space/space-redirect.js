/* jshint esnext:true */

import * as xplatformApp from 'xplatform/xplatform-app';
import _ from '_';

class SpaceRedirect {

  constructor($location, $window) {
    _.extend(this, {
      $location, $window
    });
  }

  redirectIfNeeded() {
    if (this.$location.protocol() === 'http') {
      return;
    }
    this.$window.location = this.getUnsafeAddress();
  }

  getUnsafeAddress() {
    var $loc = this.$location;
    var host = $loc.host();
    if (host === 'localhost') {
      return $loc.absUrl().replace(
        'localhost:3000',
        'localhost:4000'
      ).replace('https', 'http');
    }
    return $loc.absUrl().replace(host, 'unsafe.' + host).replace('https', 'http');
  }
}

xplatformApp.service('dmSpaceRedirect', SpaceRedirect);
