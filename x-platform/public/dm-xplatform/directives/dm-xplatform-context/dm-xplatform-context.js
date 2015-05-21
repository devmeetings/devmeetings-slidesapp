/* jshint esnext:true,-W097 */

'use strict';

import * as xplatformApp from 'xplatform/xplatform-app';
import * as _ from '_';
import 'es6!xplatform/directives/dm-event-admin/dm-event-admin';

const names = {
  admin: 'Admin',
  history: 'History',
  questions: 'Share',
  chat: 'Chat',
  notes: 'Notes'
};

class ContextMenuDir {

  constructor(data) {
    _.extend(this, data);
  }

  link(scope) {
    scope.noEventMenu = true;

    scope.$watch('isEditMode', (isEditMode) => {
      if (!scope.display) {
        return;
      }
      var w = scope.with;
      if (isEditMode) {
        w.unshift('admin');
      } else {
        var idx = w.indexOf('admin');
        if (idx > -1) {
          w.splice(idx, 1);
        }
        scope.display.active = w[0];
      }
    });

    scope.$watchCollection('with', (what) => {
      what = what || ['chat'];

      scope.display = {
        event: true,
        lastActive: false,
        lastEvent: true,
      };
      what.map((w) => {
        if (w === 'history') {
          scope.display[w] = scope.user.result.acl.indexOf('trainer') > -1;
          return;
        }
        scope.display[w] = true;
      });

      scope.selectTab(what[0]);
    });

    scope.selectTab = (tab) => {
      if (scope.display.active === tab) {
        scope.toggleEventMenu();
      } else {
        scope.display.active = tab;
        if (tab) {
          scope.display.lastActive = tab;
        }
      }
    };

    scope.toggleVisibility = () => {
      if (scope.display.active) {
        scope.selectTab(false);
        scope.display.lastEvent = scope.display.event;
        scope.display.event = true;
      } else {
        scope.selectTab(scope.display.lastActive);
        scope.display.event = scope.display.lastEvent;
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

    this.initNotifications(scope);
  }


  initNotifications($scope) {
    $scope.notifications = {};
    $scope.$on('event.questions.update', function() {
      $scope.notifications.unread = true;
    });
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
      isEditMode: '=?'
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
