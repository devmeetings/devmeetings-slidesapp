define(['angular',
  '_',
  'xplatform/xplatform-app',
  'directives/plugins-loader',
  'xplatform/services/dm-slidesaves/dm-slidesaves'
], function(angular, _, xplatformApp) {
  xplatformApp.controller('dmXplatformSlide', ['$scope', '$q', '$state', '$stateParams', '$timeout', 'dmSlidesaves', 'dmEvents', 'dmBrowserTab',
    function($scope, $q, $state, $stateParams, $timeout, dmSlidesaves, dmEvents, dmBrowserTab) {
      //

      dmSlidesaves.saveWithId($stateParams.slide).then(function(save) {
        $scope.slide = save;
        dmBrowserTab.setTitleAndIcon(save.name, 'slide');
      });

      dmSlidesaves.getSaveType($state.params.slide).then(function(type) {
        $scope.slideWarningType = type;

        if (type && type !== 'workspace') {
          $scope.mode = 'player';
        } else {
          $scope.mode = '';
        }
      });

      var sendWithDebounce = _.debounce(function(slide) {
        var type = $scope.slideWarningType;
        if (type !== 'mine' && type !== 'other') {
          dmSlidesaves.saveModified(slide);
        }
      }, 200);

      $scope.state = dmEvents.getState($stateParams.event, 'save');

      $scope.mode = '';

      $scope.$watch('slide', function(a, b) {
        if ($scope.slide) {
          sendWithDebounce($scope.slide);
          $scope.state.save = $scope.slide;
          // Disable player mode (TODO: Timeout because this is not best method to determine if something should actually be disabled)
          if (a === b) {
            return;
          }

          $timeout(function(){
            $scope.mode = '';
          }, 3000);
        }
      }, true);

      $scope.getMode = function() {
        return 'player';
      };
    }
  ]);
});
