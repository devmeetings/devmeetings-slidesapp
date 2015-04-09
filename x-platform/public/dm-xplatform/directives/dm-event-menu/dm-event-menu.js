/* jshint esnext:true,-W097 */

'use strict';

import * as xplatformApp from 'xplatform/xplatform-app';

class EventMenu {

  link(scope) {
    scope.iteration = {
      active: {},
      currentIdx: 0,
      currentTaskIdx: 0
    };

    scope.$watch('activeIteration', (idx) => {
      if (!idx) {
        return;
      }
      scope.iteration.currentIdx = parseInt(idx, 10);
    });

    scope.$watch('iteration.currentIdx', (idx) => {
      scope.iteration.active = scope.event.iterations[idx];
      scope.iteration.currentTaskIdx = 0;
    });
  }

}


xplatformApp.directive('dmEventMenu', () => {

  let eventMenu = new EventMenu({});

  return {
    restrict: 'E',
    replace: true,
    scope: {
      event: '=',
      activeIteration: '='
    },
    templateUrl: '/static/dm-xplatform/directives/dm-event-menu/dm-event-menu.html',
    link: eventMenu.link.bind(eventMenu)
  };

});
