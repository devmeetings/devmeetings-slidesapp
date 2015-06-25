/* jshint esnext:true,-W097 */
'use strict';

import _ from '_';
import viewTemplate from './dm-online.html!text';

class DmOnline {

  constructor( data) {
    _.extend(this, data);
  }

  link( scope) {}

}

export function dmOnline () {
  return {
    restrict: 'E',
    scope: {
      isOnline: '='
    },
    template: viewTemplate,
    link( /*args*/ ) {
      let online = new DmOnline({});
      online.link.apply(online, arguments);
    }
  };
}
