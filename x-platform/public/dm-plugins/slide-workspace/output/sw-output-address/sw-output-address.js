/* jshint esnext:true,-W097 */
'use strict';


import sliderPlugins from 'slide/slider.plugins';
import * as module from 'module';


var path = sliderPlugins.extractPath(module);

sliderPlugins.directive('swOutputAddress', () => {

  return {
    restrict: 'E',
    scope: {
      withAddress: '=',
      onRefresh: '&',
      highlightRefresh: '=',
      hideBaseUrl: '=',
      baseUrl: '=',
      currentPath: '=',
      appliedPath: '='
    },
    templateUrl: path + '/sw-output-address.html',
    link: function(scope) {
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
