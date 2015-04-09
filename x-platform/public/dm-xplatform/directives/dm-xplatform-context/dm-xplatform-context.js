/* jshint esnext:true,-W097 */

'use strict';

import * as xplatformApp from 'xplatform/xplatform-app';
import * as _ from '_';

const names = {
  annotations: 'Annotations',
  history: 'History',
  user: 'User',
  questions: 'Questions',
  chat: 'Chat',
};

function hasBigScreen(window) {
  return window.innerHeight > 800;
}

class ContextMenuDir {

  constructor(data) {
    _.extend(this, data);
  }

  link(scope) {

    scope.$watch('with', (what) => {
      what = what || ['chat'];

      scope.display = {
        event: true
      };
      what.map((w) => {
        scope.display[w] = true;
      });

      if (scope.noEventMenu || hasBigScreen(this.$window)) {
        scope.selectTab(what[0]);
      }
    });

    scope.selectTab = (tab) => {
      if (scope.display.active === tab) {
        scope.toggleEventMenu();
      } else {
        scope.display.active = tab;
      }
    };

    scope.toggleEventMenu = () => {
      scope.display.event = !scope.display.event;
    };

    scope.$watch(() => {
      return this.$stateParams.iteration;
    }, (it) => {
      scope.activeIteration = it;
    });

    scope.names = names;
  }

}


xplatformApp.directive('dmXplatformContext', ($stateParams, $window) => {


  return {
    restrict: 'E',
    replace: true,
    scope: {
      with: '=?',
      event: '=',
      user: '=',
      opened: '=',
      noEventMenu: '=?'
    },
    templateUrl: '/static/dm-xplatform/directives/dm-xplatform-context/dm-xplatform-context.html',
    link: (scope) => {
      let contextMenu = new ContextMenuDir({
        $stateParams, $window
      });
      contextMenu.link(scope);
    }
  };

});
