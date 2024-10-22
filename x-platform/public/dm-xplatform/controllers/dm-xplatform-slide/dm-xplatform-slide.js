/* globals define */
define(['angular',
  '_',
  'dm-xplatform/xplatform-app',
  'directives/plugins-loader',
  'dm-xplatform/services/dm-slidesaves/dm-slidesaves'
], function (angular, _, xplatformApp) {
  xplatformApp.controller('dmXplatformSlide',
    function ($scope, $rootScope, $state, $stateParams, $timeout, dmSlidesaves, dmPlayer, dmEvents, dmBrowserTab, dmEventLive, dmIntro) {
      //
      $scope.setPinRight(false);

      var state = (function () {
        var name = $state.current.name.split('.');
        return name[name.length - 1];
      }());

      $scope.mode = 'player';
      $scope.isColoured = state !== 'task' && state !== 'workspace';
      $scope.workspaceId = $stateParams.slide;
      // Reset because the one from rootScope could be taken!
      $scope.slide = null;

      dmSlidesaves.saveWithId($stateParams.slide).then(function (save) {
        $scope.slide = save;
        // TODO [ToDr] Temporary!
        $rootScope.slide = save;
        $rootScope.slide.mode = 'player';
        $rootScope.recorder = $scope.recorderSlide;

        dmPlayer.setRecorderSource($scope.recorderSlide, save.statesaveId, save.slide);

        // task because of workspace.task
        if (state === 'workspace' || state === 'task') {
          dmBrowserTab.setTitleAndIcon('Your code', 'code');
          $scope.mode = '';
          $rootScope.slide.mode = '';
        // dmIntro.startIfFirstTime('workspace', '.dm-slide-left');
        } else if (state === 'question') {
          $timeout(function () {
            $scope.mode = '';
            $rootScope.slide.mode = '';
          }, 5000);
          dmBrowserTab.setTitleAndIcon('Question', 'slide');
        } else if (state === 'watch') {
          dmEventLive.createWorkspacePlayerSource($scope, save._id, save.statesaveId, save.slide);
          dmBrowserTab.setTitleAndIcon(save.title, 'movie');
        } else {
          dmBrowserTab.setTitleAndIcon(save.title, 'slide');
        }
      });

      // TODO [ToDr] Sharing state for questions!
      var questionState = dmEvents.getState($stateParams.event, 'save');

      var saveLater = _.throttle(function () {
        if (state !== 'workspace' && state !== 'task') {
          return;
        }

        if (!$scope.slide || $scope.slide.user !== $scope.currentUserId) {
          return;
        }

        dmPlayer.getCurrentStateId().then(function (stateId) {
          dmSlidesaves.saveModified($scope.slide._id, stateId, dmPlayer.shouldRefreshPage);
        });
      }, 1000, {
        leading: false,
        trailing: true
      });

      $scope.$watch('slide', function () {
        questionState.save = $scope.slide;

        saveLater();
      }, true);
    });
});
