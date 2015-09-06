'use strict';

import sliderPlugins from 'slider/slider.plugins';
import _ from '_';
import WorkspaceUndoManager from '../workspace-undo-manager';
import viewTemplate from './slide-workspace.html!text';

class SwMain {

  constructor (data) {
    _.extend(this, data);
  }

  isAutoOutput () {
    return this.$rootScope.performance.indexOf('workspace_output_noauto') === -1;
  }

  controller (self) {
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

    self.getSizeForContent = (val) => {
      if (self.output.hideOutput) {
        return 'calc(100% - 4px)';
      }
      return val;
    };

    this.$scope.$watch(() => self.recorder && self.recorder.workspaceId, (workspaceId) => {
      self.workspaceId = workspaceId;
    });

    this.$scope.$watch(() => self.workspace.layout, (layout) => {
      if (!layout) {
        layout = defaultLayout;
      }
      self.layout.name = layout.name;
      self.layout.options = layout.options || defaultLayout.options;
    });

    this.$scope.$watch(() => self.layout.name, (name) => {
      if (!self.workspace.layout || !name) {
        return;
      }
      self.workspace.layout.name = name;
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
  .registerPlugin('slide', 'workspace', 'slide-workspace-new', {
    order: 3850,
    name: 'Workspace',
    description: 'Displays mini IDE on the slide (file management) and code output',
    example: {
      meta: {
        active: {
          type: 'string',
          help: 'Name of active tab'
        },
        tabs: {
          type: '[tabName] => { content: "", editor: {}}',
          help: 'Object that contains code and editor state (selection) on all tabs.'
        },
        layout: {
          name: {
            type: 'string',
            help: 'Name of the layout to display [tabs, tabs-v, angular, grid]'
          },
          options: {
            type: ['string'],
            help: 'Options to specific layout. Patterns of file names that should be displayed in specific space ["*.html", "*.js"]'
          }
        },
        showUrl: {
          type: 'boolean',
          help: 'When set to false - do not display address bar by default'
        },
        ionic: {
          type: 'boolean',
          help: 'Display output as phone and add Android App download link'
        },
        url: {
          type: 'string',
          help: 'Current value of address field (not applied)'
        },
        permaUrl: {
          type: 'string',
          help: 'Applied value of address field - affects output'
        },
        cdn: {
          active: {
            type: 'bool',
            help: 'Should display CDN dropdown menu'
          },
          libraries: [{
            name: {
              type: 'string',
              help: 'Name to display'
            },
            source: {
              type: 'string',
              help: 'URL to add'
            },
            tagCategory: {
              type: 'string',
              help: '["script", "link"]'
            }
          }]
        }
      },
      data: {
        'active': 'index|html',
        'cdn': {
          'active': true,
          'libraries': []
        },
        'tabs': {
          'index|html': {
            'content': '<html>\n<head></head>\n<body>\n<h1>Hello World</h1>\n<script src="main.js"></script>\n</body>\n</html>'
          },
          'main|js': {
            'content': 'document.querySelector("h1").innerHTML = "Hello!";'
          }
        }
      }
    }
  })
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
      template: viewTemplate,
      controller ($scope) {
        let sw = new SwMain({
          $rootScope, $scope, $timeout
        });
        sw.controller(this);
      }
    };
  });
