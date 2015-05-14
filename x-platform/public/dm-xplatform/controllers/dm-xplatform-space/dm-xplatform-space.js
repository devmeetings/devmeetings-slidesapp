define([
  '_',
  'xplatform/xplatform-app',
  'xplatform/services/dm-events/dm-events',
  'xplatform/services/dm-questions/dm-questions',
  'es6!xplatform/services/dm-event-live/dm-event-live',
  'es6!xplatform/services/dm-ranking/dm-ranking',
  'xplatform/directives/dm-iframe/dm-iframe',
  'xplatform/directives/dm-xplatform-performance/dm-xplatform-performance',
  'xplatform/directives/dm-intro/dm-intro',
  'xplatform/directives/dm-annotations/dm-annotations',
  'es6!xplatform/directives/dm-ranking/dm-ranking',
  'es6!xplatform/directives/dm-xplatform-context/dm-xplatform-context',
  'es6!xplatform/directives/dm-xplatform-menu/dm-xplatform-menu',
  'xplatform/filters/liveLinkUrl',
  'es6!./space-visuals',
  'es6!./space-redirect'
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
