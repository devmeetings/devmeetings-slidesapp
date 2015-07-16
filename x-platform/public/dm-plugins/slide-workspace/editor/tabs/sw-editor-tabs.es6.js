/* jshint esnext:true,-W097 */
'use strict';

import sliderPlugins from 'slider/slider.plugins';
import _ from '_';
import getExtension from 'dm-modules/dm-editor/get-extension.es6';
import viewTemplate from './sw-editor-tabs.html!text';

function tabNameToFileName (name) {
  return name.replace(/\|/g, '.');
}

class Tab {

  constructor (tabName) {
    this.name = tabName;
    this.fileName = this.getFileName();
    this.type = this.getExtension();
    this.order = this.getOrder();
  }

  getFileName () {
    return tabNameToFileName(this.name);
  }

  getExtension () {
    return getExtension(this.name);
  }

  getOrder () {
    var tabNameParts = this.name.split('/');
    var file = tabNameParts.pop();
    var dir = tabNameParts.join('/');

    return dir + '/' + getExtension(file);
  }

}

class SwEditorTabs {

  constructor (data) {
    _.extend(this, data);
  }

  controller (self) {
    self.moveTabsLeftThreshold = 5;

    self.insertTab = () => this.insertTab(self);
    self.removeTab = (name) => this.removeTab(self, name);
    self.editTabName = (name) => this.editTabName(self, name);
    self.activateTab = (name) => this.activateTab(self, name);
    self.shouldDisplayTooltip = (name) => this.shouldDisplayTooltip(self, name);
    self.promptForName = (textForUser, path) => this.promptForName(textForUser, path);
    self.editTabName = (path) => this.editTabName(self, path);
    self.removeTab = (path) => this.removeTab(self, path);
    self.makeTab = (path) => this.makeTab(self, path);
    self.makePathEdition = (oldPath, newPath) => this.makePathEdition(self, oldPath, newPath);
    self.deleteTabAndFixActive = (oldPath, newPath) => this.deleteTabAndFixActive(self, oldPath, newPath);

    this.initTreeOptions(self);

    this.$scope.$watchCollection(() => Object.keys(self.tabs), (tabNames) => {
      self.tabsObjects = this.createTabObjects(tabNames);
      this.prepareTreeStructure(self, self.tabsObjects);
      // this.$log.log(self.treeStructure);

    });
  }

  initTreeOptions (self) {
    self.treeOptions = {
      nodeChildren: 'children',
      dirSelectable: false,
      injectClasses: {
        // TODO [ToDr] Very hackys
        // @see: https://github.com/wix/angular-tree-control/issues/74
        li: 'type-{{ node.ext }}',
        iExpanded: 'fa fa-fw fa-folder-open',
        iCollapsed: 'fa fa-fw fa-folder'
      }
    };
  }

  prepareTreeStructure (self, tabsObjects) {

    function newNode (name, pathPreffix, tabObject) {
      let fileName = tabNameToFileName(name);
      let path = (pathPreffix ? (pathPreffix + '/') : '') + name;
      return {
        name: name,
        path: path,
        isFile: path === tabObject.name,
        ext: tabObject.type,
        fileName: fileName,
        children: []
      };
    }

    function createNodeAndReturnChildren (tabObject) {
      return function (currentLevel, name) {
        var node = _.find(currentLevel.children, {
          name: name
        });

        if (!node) {
          node = newNode(name, currentLevel.pathPreffix, tabObject);
          currentLevel.children.push(node);
        }

        return {
          children: node.children,
          pathPreffix: node.path
        };
      };
    }

    function createStructureForSingleFile (topLevel, tabObject) {
      let parts = tabObject.name.split('/');
      parts.reduce(createNodeAndReturnChildren(tabObject), {
        children: topLevel,
        pathPreffix: ''
      });

      return topLevel;
    }

    function convertStructure (input) {
      return input.reduce(createStructureForSingleFile, []);
    }

    function getAllNodes (structure) {
      return structure.reduce((memo, item) => {
        return memo.concat([item]).concat(getAllNodes(item.children));
      }, []);
    }

    function findNodeForActiveTab (nodes) {
      return _.find(nodes, {
        path: self.activeTabName
      });
    }

    self.treeStructure = convertStructure(tabsObjects);
    self.expandedNodes = getAllNodes(self.treeStructure);
    self.selectedNode = findNodeForActiveTab(self.expandedNodes);
  }

  createTabObjects (tabNames) {
    return _.sortBy(
      tabNames
        .map((tabName) => new Tab(tabName)),
      'order');
  }

  activateTab (self, tabName) {
    self.activeTabName = tabName;
  }

  makeTab (self, path) {
    self.allTabs[path] = {
      'content': ''
    };
    self.activeTabName = path;
    self.editorUndoManager.initTab(path);
  }

  insertTab (self) {
    var name = this.promptForName('Insert new filename');
    if (!name) {
      return;
    }
    this.makeTab(self, name);
  }

  removeTab (self, tabName) {
    let sure = this.promptForRemoval(tabName);
    if (!sure) {
      return;
    }
    this.deleteTabAndFixActive(self, tabName);
  }

  makePathEdition (self, oldPath, newPath) {
    self.allTabs[newPath] = self.allTabs[oldPath];
    this.deleteTabAndFixActive(self, oldPath, newPath);
    self.editorUndoManager.initTab(newPath);
  }

  editTabName (self, tabName) {
    var newName = this.promptForName('Insert new filename', tabName);
    if (!newName || newName === tabName) {
      return;
    }
    this.makePathEdition(self, tabName, newName);
  }

  deleteTabAndFixActive (self, oldPath, newPath) {
    delete self.allTabs[oldPath];
    self.editorUndoManager.removeTab(oldPath);

    if (self.activeTabName === oldPath) {
      self.activeTabName = newPath || Object.keys(self.tabs)[0];
    }
  }

  // This is temporary hack!
  promptForName (textForUser, path) {
    var name = this.$window.prompt(textForUser, path ? path.replace(/\|/g, '.') : '');
    if (!name) {
      return;
    }
    return name.replace(/\./g, '|');
  }

  promptForRemoval (tabName) {
    return this.$window.confirm('Sure to remove ' + tabName.replace(/\|/g, '.') + '?');
  }

  shouldDisplayTooltip (self, path) {
    let hasLongName = path.length > 15;
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
        $scope, $window
      });
      tabs.controller(this);
    }
  };

});
