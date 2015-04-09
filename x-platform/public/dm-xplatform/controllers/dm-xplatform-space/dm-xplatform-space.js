define([
  '_',
  'xplatform/xplatform-app',
  'xplatform/controllers/dm-xplatform-upload/dm-xplatform-upload',
  'xplatform/services/dm-events/dm-events',
  'xplatform/services/dm-questions/dm-questions',
  'es6!xplatform/services/dm-event-live/dm-event-live',
  'xplatform/directives/dm-iframe/dm-iframe',
  'xplatform/directives/dm-xplatform-performance/dm-xplatform-performance',
  'xplatform/directives/dm-intro/dm-intro',
  'es6!xplatform/directives/dm-xplatform-context/dm-xplatform-context',
  'xplatform/filters/liveLinkUrl',
  'es6!./space-visuals'
], function(_, xplatformApp) {
  xplatformApp.controller('dmXplatformSpace', function(
    $window, $scope, $stateParams, dmSpaceVisuals, dmEventLive,
    $http, $modal, dmEvents, dmUser, dmQuestions, dmSlidesaves, dmBrowserTab) {

    dmSpaceVisuals.initialize($scope, $window);

    dmUser.getCurrentUser().then(function(data) {
      $scope.user = data;
      $scope.currentUserId = data.result._id;
    });

    dmQuestions.allQuestionsForEvent($stateParams.event, true);
    dmSlidesaves.allSaves(true);

    dmBrowserTab.setTitleAndIcon('xPlatform');
    dmEvents.getEvent($stateParams.event, true).then(function(data) {
      if (!data) {
        return;
      }
      $scope.event = data;
      dmBrowserTab.setTitleAndIcon(data.title);
    });

    // Fetch current workspace
    dmEvents.getWorkspace($stateParams.event).then(function(workspaceId) {
      $scope.workspaceId = workspaceId;
      // Listen to users inside event
      dmEventLive.listenToUsersOnline($scope, $stateParams.event, workspaceId, onUserInSpace);
      dmSlidesaves.refresh();
    });

    $scope.users = [];

    function onUserInSpace(userData) {
      var user = userData.user;

      $scope.$apply(function() {
        if (userData.action === 'joined') {
          $scope.users.push(user);
          return;
        }

        if (userData.action === 'left') {
          _.remove($scope.users, function(u) {
            return u._id === user._id;
          });
          return;
        }

        if (userData.action === 'initial') {
          $scope.users = userData.users;
          return;
        }

        if (userData.action === 'state.count') {
          // find user with specific owrkspace
          user = _.find($scope.users, {
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

    $scope.createMaterial = function(i) {
      $modal.open({
        templateUrl: '/static/dm-xplatform/controllers/dm-xplatform-upload/index.html',
        controller: 'dmXplatformUpload',
        resolve: {
          event: function() {
            return $scope.event;
          },
          iteration: function() {
            return i;
          }
        }
      });
    };
  });
});
