/* jshint esnext:true,-W097 */
'use strict';


import sliderPlugins from 'slider/slider.plugins';
import _ from '_';
import formatter from './sw-editor-formatter.es6';



class SwEditorTools {

  constructor(data) {
    _.extend(this, data);
  }

  controller(self) {
    this.initUploading(self);
    this.initTabFormatting(self);
  }


  initTabFormatting(self) {
    this.$scope.$watch(() => self.activeTabName, (activeTabName) => {
      self.hasFormatting = formatter.hasFormattingForName(activeTabName);
    });

    self.formatTab = () => {
      if (!self.hasFormatting) {
        return;
      }

      formatter.format(self.activeTabName, self.activeTab.content, (newContent) => {
        this.$scope.$apply(() => {
          self.activeTab.content = newContent;
          self.onRefreshContent();
        });
      });
    };

    self.toggleAutoReload = () => {
      this.setAutoReload(!this.isAutoReload());
    };

    self.isAutoReload = () => this.isAutoReload();
  }

  isAutoReload() {
    return this.$rootScope.performance.indexOf('workspace_output_noauto') === -1;
  }

  setAutoReload(enabled) {
    let perf = this.$rootScope.performance;

    if (enabled && !this.isAutoReload()) {
      perf.splice(perf.indexOf('workspace_output_noauto'), 1);
      return;
    }
    if (!enabled && this.isAutoReload()) {
      perf.push('workspace_output_noauto');
      return;
    }
  }



  initUploading(self) {
    self.onFileSelect = ($files) => {
      if (!this.$window.confirm('Uploading file will erase your current workspace. Continue?')) {
        return;
      }
      //$files: an array of files selected, each file has name, size, and type.
      self.isUploading = true;
      self.uploadingState = 0;
      $files.forEach((file) => {
        this.Upload.upload({
          url: '/api/upload',
          file: file
        }).progress((evt) => {
          this.$scope.$apply(() => {
            self.uploadingState = parseInt(100.0 * evt.loaded / evt.total);
          });
        }).success((data) => {

          self.isUploading = false;
          // override workspace
          var ws = {};
          ws.active = null;
          ws.tabs = {};
          _.each(data, function(value, name) {
            ws.active = name;
            ws.tabs[name] = {
              content: value
            };
          });

          self.onNewWorkspace({
            workspace: ws
          });
        });
      });
    };
  }

}

sliderPlugins.directive('swEditorTools', ($window, $rootScope, Upload) => {

  return {
    restrict: 'E',
    scope: {
      withUrlButton: '=',
      showUrl: '=',
      hideOutput: '=',

      currentUrl: '=',
      downloadId: '=',
      activeTab: '=',
      activeTabName: '=',
      onNewWorkspace: '&',
      onRefreshContent: '&',
      cdnLibraries: '='
    },
    bindToController: true,
    controllerAs: 'model',
    templateUrl: '/static/dm-plugins/slide-workspace/editor/tools/sw-editor-tools.html',
    controller: function($scope, $log) {
      let tools = new SwEditorTools({
        $scope, $rootScope, $window, Upload
      });
      tools.controller(this);

    }
  };
});
