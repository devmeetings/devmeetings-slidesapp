/* jshint esnext:true,-W097 */
'use strict';


import sliderPlugins from 'slider/slider.plugins';
import * as module from 'module';


var path = sliderPlugins.extractPath(module);

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
      appliedPath: '='
    },
    bindToController: true,
    controllerAs: 'model',
    templateUrl: path + '/sw-output-address.html',
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
