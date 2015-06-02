/* jshint esnext:true,-W097 */
'use strict';

import sliderPlugins from 'slider/slider.plugins';
import * as module from 'module';
import WorkspaceUndoManager from '../workspace-undo-manager';

let path = sliderPlugins.extractPath(module);


function controllerF(self, $scope) {
  self.output = {};
  self.layout = {
    name: 'tabs'
  };

  self.undoManager = new WorkspaceUndoManager(self, self.workspace.tabs);

  // When changing slides
  $scope.$watch(() => self.workspace.tabs, () => {
    self.undoManager.reset();
  });

  self.onNewWorkspace = (workspace) => {
    self.workspace.active = workspace.active;
    self.workspace.tabs = workspace.tabs;
  };

  self.onEditorChange = () => {
    sliderPlugins.trigger('slide.slide-workspace.change', self.workspace);
  };

  self.onRefresh = () => {
    $scope.$broadcast('refreshUrl');
  };
}

sliderPlugins
  .registerPlugin('slide', 'workspace', 'slide-workspace-new', 3850)
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
