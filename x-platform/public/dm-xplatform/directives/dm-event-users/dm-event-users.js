/* jshint esnext:true,-W097 */

'use strict';

import xplatformApp from 'dm-xplatform/xplatform-app';
import _ from '_';
import viewTemplate from './dm-event-users.html!text';

class EventUsers {

  constructor (data) {
    _.extend(this, data);
  }

  link ($scope) {
    // Listen to users inside event
    $scope.$watch('event._id', (eventId) => {
      if (!eventId) {
        return;
      }

      this.dmEvents.getWorkspace(eventId).then((workspaceId) => {
        this.dmEventLive.listenToUsersOnline($scope, eventId, workspaceId, onUserInSpace);
      });

    });

    $scope.allUsers = [];
    $scope.uniqueUsers = [];

    function rebuildUniqueUsers () {
      $scope.uniqueUsers = _.uniq($scope.allUsers, 'workspaceId');
      _.remove($scope.uniqueUsers, function (u) {
        return u._id === $scope.user.result._id;
      });
    }

    function onUserInSpace (userData) {
      var user = userData.user;

      $scope.$apply(function () {
        if (userData.action === 'joined') {
          $scope.allUsers.push(user);
          rebuildUniqueUsers();
          return;
        }

        if (userData.action === 'left') {
          // Remove only one user!
          var user2 = _.find($scope.allUsers, function (u) {
            return u._id === user._id;
          });
          if (!user2) {
            return;
          }
          $scope.allUsers.splice($scope.allUsers.indexOf(user2), 1);
          rebuildUniqueUsers();
          return;
        }

        if (userData.action === 'initial') {
          $scope.allUsers = userData.users;
          rebuildUniqueUsers();
          return;
        }

        if (userData.action === 'state.count') {
          // find user with specific owrkspace
          user = _.find($scope.uniqueUsers, {
            workspaceId: userData.workspaceId
          });
          if (user) {
            user.workspaceListeners = userData.count;
          } else if (userData.workspaceId === $scope.workspaceId) {
            $scope.user.result.workspaceListeners = userData.count;
          }
          return;
        }
      });
    }

  }

}

xplatformApp.directive('dmEventUsers', (dmEvents, dmEventLive) => {

  return {
    restrict: 'E',
    replace: true,
    scope: {
      event: '=',
      user: '=',
      userWorkspaceId: '=',
      opened: '='
    },
    template: viewTemplate,
    link (scope, element) {
      let eventMenu = new EventUsers({
        dmEvents, dmEventLive
      });
      eventMenu.link(scope, element);
    }
  };

});
