/* jshint esnext:true,-W097 */
'use strict';

import sliderPlugins from 'slider/slider.plugins';
import * as _ from '_';
import WorkspaceUndoManager from '../workspace-undo-manager';

class SwMain {

  constructor(data) {
    _.extend(this, data);
  }

  isAutoOutput() {
    return this.$rootScope.performance.indexOf('workspace_output_noauto') === -1;
  }

  controller(self) {
    self.output = {};
    let defaultLayout = {
      name: 'tabs',
      options: ['*.html', '*.js', '*.css']
    };
    self.layout = _.clone(defaultLayout);

    self.undoManager = new WorkspaceUndoManager(self, self.workspace.tabs);

    self.onNewWorkspace = (workspace) => {
      self.workspace.active = workspace.active;
      self.workspace.tabs = workspace.tabs;
    };

    self.onEditorChange = () => {
      sliderPlugins.trigger('slide.slide-workspace.change', self.workspace);
    };

    self.onEvalOutput = () => {
      self.output.needsEval = false;
      this.$scope.$broadcast('evalOutput');
    };

    self.onRefresh = () => {
      this.$scope.$broadcast('refreshUrl');
    };

    self.evalIfAutoOutput = () => {
      self.output.needsEval = true;
      if (this.isAutoOutput()) {
        self.onEvalOutput();
      }
    };
    
    this.$scope.$watch(() => self.recorder.workspaceId, (workspaceId) => {
      self.workspaceId = workspaceId;
    });

    this.$scope.$watch(() => self.workspace.layout, (layout) => {
      if (!layout) {
        layout = defaultLayout;
      }
      self.layout.name = layout.name;
      self.layout.options = layout.options || defaultLayout.options;
    });

    this.$scope.$watch(() => self.output.codeId, (newCodeId, oldCodeId) => {
      if (newCodeId === oldCodeId) {
        return;
      }
      self.evalIfAutoOutput();
    });

    // When changing slides
    this.$scope.$watch(() => self.workspace.tabs, () => {
      self.undoManager.reset();
    });

    this.$timeout(() => {
      self.evalIfAutoOutput();
    }, 500);
  }

}

sliderPlugins
  .registerPlugin('slide', 'workspace', 'slide-workspace-new', 3850)
  .directive('slideWorkspaceNew', ($rootScope, $timeout) => {
    return {
      restrict: 'E',
      scope: {
        workspace: '=data',
        slide: '=context',
        recorder: '=recorder',
        path: '@',
        mode: '='
      },
      bindToController: true,
      controllerAs: 'model',
      templateUrl: '/static/dm-plugins/slide-workspace/workspace/slide-workspace.html',
      controller($scope) {
        let sw = new SwMain({
          $rootScope, $scope, $timeout
        });
        sw.controller(this);
      }
    };
  });
