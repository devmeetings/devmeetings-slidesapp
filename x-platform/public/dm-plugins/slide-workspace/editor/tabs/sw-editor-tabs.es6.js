/* jshint esnext:true,-W097 */
'use strict';

import sliderPlugins from 'slider/slider.plugins';
import _ from '_';
import getExtension from 'dm-modules/dm-editor/get-extension.es6';
import viewTemplate from './sw-editor-tabs.html!text';
import modalView from './sw-editor-tabs-modal.html!text';
import './sw-editor-tabs-modal';

function tabNameToFileName (name) {
  return name.replace(/\|/g, '.');
}

class Tab {

  constructor (tabName) {
    this.name = tabName;
    this.path = tabName;
    this.fileName = this.getFileName();
    this.type = this.getExtension();
    this.order = this.getOrder();
    this.isFile = true;
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
    self.displayModal = (textForUser, path, mode) => this.displayModal(textForUser, path, mode);
    self.editTabName = (path) => this.editTabName(self, path);
    self.removeTab = (path) => this.removeTab(self, path);
    self.makeTab = (path) => this.makeTab(self, path);
    self.makePathEdition = (oldPath, newPath) => this.makePathEdition(self, oldPath, newPath);
    self.deleteTabAndFixActive = (oldPath, newPath) => this.deleteTabAndFixActive(self, oldPath, newPath);

    this.initTreeOptions(self, this.$window.localStorage);

    this.$scope.$watchCollection(() => Object.keys(self.tabs), (tabNames) => {
      self.tabsObjects = this.createTabObjects(tabNames);
      this.prepareTreeStructure(self, self.tabsObjects);
    });
  }

  initTreeOptions (self, localStorage) {
    self.toggleTree = localStorage.getItem('tree.open') !== 'false';
    this.$scope.$watch(() => self.toggleTree, () => {
      localStorage.setItem('tree.open', self.toggleTree);
    });

    self.treeOptions = {
      nodeChildren: 'children',
      allowDeselect: false,
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
      let path = name;
      if (pathPreffix) {
        path = pathPreffix + '/' + name;
      }
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

    this.$scope.$watch(() => self.activeTabName, () => {
      self.selectedNode = findNodeForActiveTab(self.expandedNodes);
    });
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
    this.displayModal('Insert new filename:', false).then((newPath) => {
      if (!newPath) {
        return;
      }
      this.makeTab(self, newPath);
    });
  }

  removeTab (self, tabName) {
    var text = 'Sure to remove ' + tabName.replace(/\|/g, '.') + '?';
    this.displayModal(text, tabName, 'removeMode').then((tabName) => {
      this.deleteTabAndFixActive(self, tabName);
    });
  }

  makePathEdition (self, oldPath, newPath) {
    self.allTabs[newPath] = self.allTabs[oldPath];
    this.deleteTabAndFixActive(self, oldPath, newPath);
    self.editorUndoManager.initTab(newPath);
  }

  editTabName (self, oldPath) {
    this.displayModal('Insert new filename:', oldPath).then((newPath) => {
      if (!newPath || newPath === oldPath) {
        return;
      }
      this.makePathEdition(self, oldPath, newPath);
    });
  }

  deleteTabAndFixActive (self, oldPath, newPath) {
    delete self.allTabs[oldPath];
    self.editorUndoManager.removeTab(oldPath);

    if (self.activeTabName === oldPath) {
      self.activeTabName = newPath || Object.keys(self.tabs)[0];
    }
  }

  shouldDisplayTooltip (self, path) {
    let hasLongName = path.length > 15;
    return hasLongName;
  }

  displayModal (textForUser, oldPath, mode) {
    var modalInstance = this.$modal.open({
      template: modalView,
      controller: 'SwEditorTabsModalCtrl',
      controllerAs: 'modal',
      resolve: {
        textForUser: function () {
          return textForUser;
        },
        oldPath: function () {
          return oldPath;
        },
        mode: function () {
          return mode;
        }
      },
      size: 'sm'
    });
    return modalInstance.result;
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
    controller: function ($scope, $window, $modal) {
      let tabs = new SwEditorTabs({
        $scope, $window, $modal
      });
      tabs.controller(this);
    }
  };
});
