/* jshint esnext:true,-W097 */
'use strict';

import sliderPlugins from 'slider/slider.plugins';
import _ from '_';
import getExtension from 'dm-modules/dm-editor/get-extension.es6';
import viewTemplate from './sw-editor-tabs.html!text';

class Tab {

  constructor( tabName) {
    this.name = tabName;
    this.fileName = this.getFileName();
    this.type = this.getExtension();
    this.order = this.getOrder();
  }

  getFileName() {
    return this.name.replace(/\|/g, '.');
  }

  getExtension() {
    return getExtension(this.name);
  }

  getOrder() {
    var tabNameParts = this.name.split('/');
    var file = tabNameParts.pop();
    var dir = tabNameParts.join('/');

    return dir + '/' + getExtension(file);
  }

}

class SwEditorTabs {

  constructor( data) {
    _.extend(this, data);
  }

  controller( self) {
    self.moveTabsLeftThreshold = 5;

    self.insertTab = () => this.insertTab(self);
    self.removeTab = (name) => this.removeTab(self, name);
    self.editTabName = (name) => this.editTabName(self, name);
    self.activateTab = (name) => this.activateTab(self, name);

    self.shouldDisplayTooltip = (name) => this.shouldDisplayTooltip(self, name);

    this.$scope.$watchCollection(() => Object.keys(self.tabs), (tabNames) => {
      self.tabsObjects = this.createTabObjects(tabNames);
    });
  }

  createTabObjects( tabNames) {
    return _.sortBy(
      tabNames
        .map((tabName) => new Tab(tabName)),
      'order');
  }

  activateTab( self, tabName) {
    if (self.activeTabName === tabName) {
      this.editTabName(self, tabName);
      return;
    }

    self.activeTabName = tabName;
  }

  insertTab( self) {
    var name = this.promptForName();
    if (!name) {
      return;
    }
    self.allTabs[name] = {
      'content': ''
    };
    self.activeTabName = name;
    self.editorUndoManager.initTab(name);
  }

  removeTab( self, tabName) {
    let sure = this.promptForRemoval(tabName);
    if (!sure) {
      return;
    }
    this.deleteTabAndFixActive(self, tabName);
  }

  editTabName( self, tabName) {
    var newName = this.promptForName(tabName);
    if (!newName) {
      return;
    }
    self.allTabs[newName] = self.allTabs[tabName];
    this.deleteTabAndFixActive(self, tabName, newName);
    self.editorUndoManager.initTab(newName);
  }

  deleteTabAndFixActive( self, tabName, newName) {
    delete self.allTabs[tabName];
    self.editorUndoManager.removeTab(tabName);

    if (self.activeTabName === tabName) {
      self.activeTabName = newName || Object.keys(self.tabs)[0];
    }
  }

  // This is temporary hack!
  promptForName( old) {
    var name = this.$window.prompt('Insert new filename', old ? old.replace(/\|/g, '.') : '');
    if (!name) {
      return;
    }
    return name.replace(/\./g, '|');
  }

  promptForRemoval( tabName) {
    return this.$window.confirm('Sure to remove ' + tabName.replace(/\|/g, '.') + '?');
  }

  shouldDisplayTooltip( self, tabName) {
    let hasLongName = tabName.length > 15;
    return hasLongName;
  }

}

sliderPlugins.directive('swEditorTabs', () => {

  return {
    restrict: 'E',
    scope: {
      tabs: '=',
      allTabs: '=',
      activeTabName: '=',
      editorUndoManager: '='
    },
    bindToController: true,
    controllerAs: 'model',
    template: viewTemplate,
    controller: function ($scope, $window) {
      let tabs = new SwEditorTabs({
      $scope, $window});
      tabs.controller(this);
    }
  };

});
