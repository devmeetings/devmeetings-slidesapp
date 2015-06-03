define([
  '_',
  'dm-xplatform/xplatform-app',
  'dm-xplatform/services/dm-events/dm-events',
  'dm-xplatform/services/dm-questions/dm-questions',
  'dm-xplatform/services/dm-event-live/dm-event-live',
  'dm-xplatform/services/dm-ranking/dm-ranking',
  'dm-xplatform/directives/dm-iframe/dm-iframe',
  'dm-xplatform/directives/dm-xplatform-performance/dm-xplatform-performance',
  'dm-xplatform/directives/dm-annotations/dm-annotations',
  'dm-xplatform/directives/dm-ranking/dm-ranking',
  'dm-xplatform/directives/dm-xplatform-context/dm-xplatform-context',
  'dm-xplatform/directives/dm-xplatform-menu/dm-xplatform-menu',
  'dm-xplatform/filters/liveLinkUrl',
  './space-visuals',
  './space-redirect'
], function(_, xplatformApp) {
  xplatformApp.controller('dmXplatformSpace', function(
    $window, $scope, $stateParams, dmSpaceVisuals, 
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
      dmSlidesaves.refresh();
    });

  });
});
