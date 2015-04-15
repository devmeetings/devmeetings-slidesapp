/* jshint esnext:true,-W097 */

'use strict';

import * as xplatformApp from 'xplatform/xplatform-app';

class EventAdmin {

  link(scope) {
  }

}


xplatformApp.directive('dmEventAdmin', () => {


  return {
    restrict: 'E',
    replace: true,
    scope: {
      event: '='
    },
    templateUrl: '/static/dm-xplatform/directives/dm-event-admin/dm-event-admin.html',
    link: ( /*args*/ ) => {
      let eventAdmin = new EventAdmin({});
      return eventAdmin.link.apply(eventAdmin, arguments);
    }
  };

});
