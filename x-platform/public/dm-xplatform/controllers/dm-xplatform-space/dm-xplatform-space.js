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
  'xplatform/filters/liveLinkUrl',
  'es6!./space-visuals'
], function(_, xplatformApp) {
  xplatformApp.controller('dmXplatformSpace', function(
    $scope, $stateParams, dmSpaceVisuals, dmEventLive,
    $http, $modal, dmEvents, dmUser, dmQuestions, dmSlidesaves, dmBrowserTab) {

    dmSpaceVisuals.initialize($scope);
    dmBrowserTab.setTitleAndIcon('xPlatform');

    dmUser.getCurrentUser().then(function(data) {
      $scope.user = data;
    });

    dmQuestions.allQuestionsForEvent($stateParams.event, true);
    dmSlidesaves.allSaves(true);


    dmEvents.getEvent($stateParams.event, true).then(function(data) {
      $scope.event = data;
      dmBrowserTab.setTitleAndIcon(data.title);
      dmUser.getCurrentUser().then(function(data) { // Q All!
        $scope.currentUserId = data.result._id;
      });

      // Fetch current workspace
      $http.post('/api/events/' + $scope.event._id + '/base_slide/' + $scope.event.baseSlide).then(function(data) {
        $scope.workspaceId = data.data.slidesave;
        dmSlidesaves.refresh();
      });
    });

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

    $scope.users = [];
    dmEventLive.listenToUsersOnline($scope, $stateParams.event, function(userData) {
      var user = userData.user;
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
    });
  });
});
