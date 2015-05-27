/* jshint esnext:true,-W097 */
'use strict';


import sliderPlugins from 'slider/slider.plugins';
import * as module from 'module';
import * as _ from '_';


class SwEditor {

  constructor(data) {
    _.extend(this, data);
  }

  controller(self) {

    // Synchronize global -> local (if I own editor)
    this.$watch(() => self.globalActiveTabName, (activeTabName) => {
      let tabNames = Object.keys(self.tabs);
      if (tabNames.indexOf(activeTabName) === -1) {
        return;
      }
      self.editorActiveTabName = activeTabName;
    });

    // Synchronize local -> global
    this.$watch(() => self.editorActiveTabName, (activeTabName) => {
      self.globalActiveTabName = activeTabName;
    });

    // Synchronize name -> tab
    this.$watch(() => self.editorActiveTabName, (activeTabName, oldName) => {
      self.editorActiveTab = self.tabs[activeTabName];
      if (activeTabName !== oldName) {
        self.editorUndoManager.setUpTabsSwitched(true);
      }
    });
  }


  $watch(...args) {
    this.$scope.$watch(...args);
  }

  $watchCollection(...args) {
    this.$scope.$watchCollection(...args);
  }

}


var path = sliderPlugins.extractPath(module);
sliderPlugins.directive('swEditor', () => {

  return {
    restrict: 'E',
    scope: {
      withTabs: '=',
      withTools: '=',
      tabs: '=',
      globalActiveTabName: '=',
      // editorActiveTabName: '=',
      editorOptions: '=',
      editorMode: '=',
      editorUndoManager: '='
    },
    bindToController: true,
    controllerAs: 'model',
    templateUrl: path + '/sw-editor.html',
    controller: function($scope) {
      let editor = new SwEditor({
        $scope
      });
      editor.controller(this);
    }
  };

});
