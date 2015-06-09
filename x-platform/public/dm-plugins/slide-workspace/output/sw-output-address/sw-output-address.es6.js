/* jshint esnext:true,-W097 */
'use strict';


import sliderPlugins from 'slider/slider.plugins';



sliderPlugins.directive('swOutputAddress', () => {

  return {
    restrict: 'E',
    replace: true,
    scope: {
      withAddress: '=',
      onRefresh: '&',
      highlightRefresh: '=',
      hideBaseUrl: '=',
      baseUrl: '=',
      currentPath: '=',
      appliedPath: '=',
      workspaceId: '='
    },
    bindToController: true,
    controllerAs: 'model',
    templateUrl: '/static/dm-plugins/slide-workspace/output/sw-output-address/sw-output-address.html',
    controller: function() {
      let scope = this;
      scope.urlKeyPress = function(ev) {
        if (ev.keyCode !== 13) {
          return;
        }
        if (scope.appliedPath === scope.currentPath) {
          scope.onRefresh();
          return;
        }
        scope.appliedPath = scope.currentPath;
      };
    }
  };

});
