define([
  '_',
  'xplatform/xplatform-app',
  'xplatform/services/dm-events/dm-events',
  'xplatform/services/dm-questions/dm-questions',
  'es6!xplatform/services/dm-event-live/dm-event-live',
  'xplatform/directives/dm-iframe/dm-iframe',
  'xplatform/directives/dm-xplatform-performance/dm-xplatform-performance',
  'xplatform/directives/dm-intro/dm-intro',
  'es6!xplatform/directives/dm-xplatform-context/dm-xplatform-context',
  'xplatform/filters/liveLinkUrl',
  'es6!./space-visuals',
  'es6!./space-redirect'
], function(_, xplatformApp) {
  xplatformApp.controller('dmXplatformSpace', function(
    $window, $scope, $stateParams, dmSpaceVisuals, dmEventLive,
    $http, $modal, dmEvents, dmUser, dmQuestions, dmSlidesaves, dmBrowserTab,
    dmSpaceRedirect) {

    dmSpaceVisuals.initialize($scope, $window);

    dmUser.getCurrentUser().then(function(data) {
      $scope.user = data;
      $scope.currentUserId = data.result._id;
    });

    dmQuestions.allQuestionsForEvent($stateParams.event, true);
    dmSlidesaves.allSaves(true);

    dmBrowserTab.setTitleAndIcon('xPlatform');
    dmEvents.getEvent($stateParams.event, true).then(function(event) {
      if (!event) {
        return;
      }
      $scope.event = event;
      dmBrowserTab.setTitleAndIcon(event.title);

      if (event.shouldRedirectToUnsafe) {
        dmSpaceRedirect.redirectIfNeeded();       
      }
    });

    // Fetch current workspace
    dmEvents.getWorkspace($stateParams.event).then(function(workspaceId) {
      $scope.workspaceId = workspaceId;
      // Listen to users inside event
      dmEventLive.listenToUsersOnline($scope, $stateParams.event, workspaceId, onUserInSpace);
      dmSlidesaves.refresh();
    });

    $scope.allUsers = [];
    $scope.uniqueUsers = [];

    function rebuildUniqueUsers() {
      $scope.uniqueUsers = _.uniq($scope.allUsers, 'workspaceId');
      _.remove($scope.uniqueUsers, function(u){
        return u._id === $scope.user.result._id;
      });
    }

    function onUserInSpace(userData) {
      var user = userData.user;

      $scope.$apply(function() {
        if (userData.action === 'joined') {
          $scope.allUsers.push(user);
          rebuildUniqueUsers();
          return;
        }

        if (userData.action === 'left') {
          // Remove only one user!
          var user2 = _.find($scope.allUsers, function(u) {
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

  });
});
