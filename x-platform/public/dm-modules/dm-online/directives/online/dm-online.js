/* jshint esnext:true,-W097 */
'use strict';

import _ from '_';


class DmOnline {

  constructor(data) {
    _.extend(this, data);
  }

  link(scope) {
  }

}


export function dmOnline() {


  return {
    restrict: 'E',
    scope: {
      isOnline: '='
    },
    templateUrl: '/static/dm-modules/dm-online/directives/online/dm-online.html',
    link( /*args*/ ) {
      let online = new DmOnline({});
      online.link.apply(online, arguments);
    }
  };
}
