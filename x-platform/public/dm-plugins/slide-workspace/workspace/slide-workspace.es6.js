/* jshint esnext:true,-W097 */
'use strict';

import sliderPlugins from 'slider/slider.plugins';
import * as module from 'module';
import WorkspaceUndoManager from '../workspace-undo-manager';

let path = sliderPlugins.extractPath(module);


function controllerF(self, $scope) {
  self.output = {};

  self.isWithAddress = () => {
    return self.workspace.showUrl !== false || self.output.showUrl;
  };

  self.undoManager = new WorkspaceUndoManager(self, self.workspace.tabs);

  // When changing slides
  $scope.$watch(() => self.workspace.tabs, () => {
    self.undoManager.reset();
  });
}

sliderPlugins
  .registerPlugin('slide', 'workspace', 'slide-workspace-new', 3900)
  .directive('slideWorkspaceNew', () => {
    return {
      restrict: 'E',
      scope: {
        workspace: '=data',
        slide: '=context',
        path: '@',
        mode: '='
      },
      bindToController: true,
      controllerAs: 'model',
      templateUrl: path + '/slide-workspace.html',
      controller($scope) {
        controllerF(this, $scope);
      }
    };
  });
