define(['angular',
  '_',
  'xplatform/xplatform-app',
  'directives/plugins-loader',
  'xplatform/services/dm-slidesaves/dm-slidesaves'
], function(angular, _, xplatformApp) {
  xplatformApp.controller('dmXplatformSlide', function($scope, $rootScope, $state, $stateParams, $timeout, dmSlidesaves, dmPlayer, dmRecorder, dmEvents, dmBrowserTab, dmEventLive) {
    //
    var state = $state.current.name.split('.')[2];

    $scope.state = dmEvents.getState($stateParams.event, 'save');
    $scope.mode = 'player';
    $scope.slideState = state;

    dmSlidesaves.saveWithId($stateParams.slide).then(function(save) {
      $scope.slide = save;
      //TODO [ToDr] Temporary!
      $rootScope.slide = save;
      $rootScope.slide.mode = 'player';

      dmPlayer.setRecorderSource($stateParams.slide, save.statesaveId, save.slide);

      if (state === 'workspace') {
        dmBrowserTab.setTitleAndIcon('Your code', 'code');
        $scope.mode = '';
        $rootScope.slide.mode = '';
      } else if (state === 'question') {
        $timeout(function() {
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

    $scope.$on('$destroy', function(){
      dmRecorder.setRecording(false, null);   
    });

    var saveSlideWithDebounce = _.debounce(function(myId) {
      if (state !== 'workspace') {
        return;
      }

      if ($scope.slide.user !== $scope.currentUserId) {
        return;
      }

      dmPlayer.getCurrentStateId().then(function(stateId) {
        dmSlidesaves.saveModified(myId, stateId);
      });
    }, 200);

    $scope.$watch('slide', function() {
      if (!$scope.slide) {
        return;
      }

      saveSlideWithDebounce($scope.slide._id);
      $scope.state.save = $scope.slide;
    }, true);
  });
});
