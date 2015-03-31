define(['angular',
  '_',
  'xplatform/xplatform-app',
  'directives/plugins-loader',
  'xplatform/services/dm-slidesaves/dm-slidesaves'
], function(angular, _, xplatformApp) {
  xplatformApp.controller('dmXplatformSlide', ['$scope', '$q', '$state', '$stateParams', '$timeout', 'dmSlidesaves', 'dmRecorder', 'dmEvents', 'dmBrowserTab',
    function($scope, $q, $state, $stateParams, $timeout, dmSlidesaves, dmRecorder, dmEvents, dmBrowserTab) {
      //
      var state = $state.current.name.split('.')[2];

      $scope.state = dmEvents.getState($stateParams.event, 'save');
      $scope.mode = 'player';
      $scope.slideState = state;

      dmSlidesaves.saveWithId($stateParams.slide).then(function(save) {
        $scope.slide = save;

        if (state === 'workspace') {
          dmBrowserTab.setTitleAndIcon('Your code', 'code');
          $scope.mode = '';
        } else if (state === 'question') {
          $timeout(function(){
            $scope.mode = '';
          }, 5000);
          dmBrowserTab.setTitleAndIcon('Question', 'slide');
        } else if (state === 'watch')  {
          dmBrowserTab.setTitleAndIcon(save.title, 'movie');
        } else {
          dmBrowserTab.setTitleAndIcon(save.title, 'slide');
        }
      });

      var saveSlideWithDebounce = _.debounce(function(myId) {
        if (state !== 'workspace') {
          return;
        }
        if ($scope.slide.user !== $scope.currentUserId) {
          return;
        }

        dmRecorder.getCurrentStateId().then(function(stateId) {
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
    }
  ]);
});
