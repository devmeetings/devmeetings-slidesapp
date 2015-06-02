/* jshint esnext:true,-W097 */
'use strict';


import sliderPlugins from 'slider/slider.plugins';
import * as module from 'module';
import * as _ from '_';
import formatter from 'es6!./sw-editor-formatter.es6';



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
      self.activeTab.content = formatter.format(self.activeTabName, self.activeTab.content);
      self.onRefreshContent();
    };
  }



  initUploading(self) {
    self.onFileSelect = ($files) => {
      if (!this.$window.confirm('Uploading file will erase your current workspace. Continue?')) {
        return;
      }
      //$files: an array of files selected, each file has name, size, and type.
      self.isUploading = true;
      self.uploadingState = 0;
      $files.forEach(function(file) {
        this.$upload.upload({
          url: '/api/upload',
          file: file
        }).progress(function(evt) {
          this.$scope.$apply(() => {
            self.uploadingState = parseInt(100.0 * evt.loaded / evt.total);
          });
        }).success(function(data) {

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

var path = sliderPlugins.extractPath(module);
sliderPlugins.directive('swEditorTools', ($window, $upload) => {

  return {
    restrict: 'E',
    scope: {
      withUrlButton: '=',
      showUrl: '=',
      currentUrl: '=',
      downloadId: '=',
      activeTab: '=',
      activeTabName: '=',
      onNewWorkspace: '&',
      onRefreshContent: '&'
    },
    bindToController: true,
    controllerAs: 'model',
    templateUrl: path + '/sw-editor-tools.html',
    controller: function($scope) {
      let tools = new SwEditorTools({
        $scope, $window, $upload
      });
      tools.controller(this);
    }
  };

});
