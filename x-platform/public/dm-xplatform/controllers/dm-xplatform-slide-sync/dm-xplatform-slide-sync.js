define(['angular',
  '_',
  'xplatform/xplatform-app',
  'directives/plugins-loader',
  'xplatform/services/dm-slidesaves/dm-slidesaves'
], function(angular, _, xplatformApp) {

  xplatformApp.controller('dmXplatformSlideSync',
    function($scope, $rootScope, $state, $stateParams, $timeout, dmSlidesaves, dmPlayer, dmRecorder, dmEvents, dmBrowserTab) {

      $scope.mode = 'player';

      dmSlidesaves.saveWithId($stateParams.slide).then(function(save) {
        $scope.slide = save;
        //TODO [ToDr] Temporary!
        $rootScope.slide = save;
        $rootScope.slide.mode = 'player';

        dmPlayer.setRecorderSource($stateParams.slide, save.statesaveId, save.slide);

        dmBrowserTab.setTitleAndIcon('Your code', 'code');
        $scope.mode = '';
        $rootScope.slide.mode = '';
      });

      if (window.watcher) {
        var w = window.watcher;
        w.watch(function(change) {
          console.log(change);
          $scope.$apply(function() {
            var change2 = Object.keys(change).reduce(function(model, key) {
              model[key.replace(/\./g, '|')] = change[key];
              return model;
            }, {});
            $scope.slide.slide.workspace.tabs = change2;
            $scope.$broadcast('slide:update', $scope.slide);
          });
        });

        $scope.$on('$destroy', function() {
          w.stop();
        });
      }

      $scope.$on('$destroy', function() {
        dmRecorder.setRecording(false, null);
      });

      $scope.$watch('slide', function() {
      }, true);

    });
});
