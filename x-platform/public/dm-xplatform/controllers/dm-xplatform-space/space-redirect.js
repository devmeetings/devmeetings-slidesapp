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
    var $loc = this.$location;
    var host = $loc.host();
    if ($loc.protocol() === 'http') {
      return;
    }
    if (host === 'localhost') {
      this.$window.location = $loc.absUrl().replace(
        'localhost:3000',
        'localhost:4000'
      ).replace('https', 'http');
      return;
    }

    this.$window.location = $loc.absUrl().replace(host, 'unsafe.' + host).replace('https', 'http');
  }

}

xplatformApp.service('dmSpaceRedirect', SpaceRedirect);
