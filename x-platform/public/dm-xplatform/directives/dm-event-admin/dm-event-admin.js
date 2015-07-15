/* jshint esnext:true,-W097 */

'use strict';

import xplatformApp from 'dm-xplatform/xplatform-app';
import viewTemplate from './dm-event-admin.html!text';

class EventAdmin {

  link (scope) {}

}

xplatformApp.directive('dmEventAdmin', () => {

  return {
    restrict: 'E',
    replace: true,
    scope: {
      event: '='
    },
    template: viewTemplate,
    link: () => {
      let eventAdmin = new EventAdmin({});
      return eventAdmin.link.apply(eventAdmin, arguments);
    }
  };

});
