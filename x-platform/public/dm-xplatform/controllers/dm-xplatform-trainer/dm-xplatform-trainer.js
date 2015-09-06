/* globals define */
define([
  'angular', 'dm-xplatform/xplatform-app',
  './services/dm-workspaces'
], function (angular, xplatformApp) {
  xplatformApp.controller('dmXplatformTrainer', [
    '$scope', '$stateParams', '$state', 'dmEvents', 'dmWorkspaces',

    function ($scope, $stateParams, $state, dmEvents, dmWorkspaces) {
      $scope.setPinRight(true);

      var eventId = $stateParams.event;

      function fetchWorkspaces () {
        dmEvents.getEvent(eventId).then(function (event) {
          $scope.eventTitle = event.title;
          dmWorkspaces.getUsersWorkspaces(event._id).then(function (workspaces) {
            $scope.workspaces = workspaces;
            rebuildOnlineState();
          });
        });
      }

      function rebuildOnlineState () {
        var users = $scope.uniqueUsers;
        var workspaces = $scope.workspaces;

        if (!users || !workspaces) {
          return;
        }

        var userIds = users.map(function (user) {
          return user._id;
        });

        workspaces.map(function (ws) {
          ws.user.isOnline = userIds.indexOf(ws.user._id) > -1;
        });
      }

      $scope.$watchCollection('uniqueUsers', fetchWorkspaces);

      $scope.fetchRecentWorkspaces = function (ws) {
        dmWorkspaces.getUserAllPages(ws.user._id).then(function (userPages) {
          ws.userPages = userPages;
        });
      };

      $scope.convertRecentWorkspaces = function (ws) {
        dmWorkspaces.convertToRecording(ws.user._id, ws.user.name, $scope.eventTitle).then(function (recordingId) {
          $state.go('index.player', {
            id: recordingId.recordingId
          });
        });
      };

      $scope.keys = function (array) {
        return Object.keys(array);
      };
    }
  ]);
});
