/* jshint esnext:true,-W097 */
'use strict';


import sliderPlugins from 'slider/slider.plugins';
import * as _ from '_';
import getExtension from 'es6!dm-modules/dm-editor/get-extension.es6';


function tabNameToFileName(name) {
  return name.replace(/\|/g, '.');
}


class Tab {

  constructor(tabName) {
    this.name = tabName;
    this.fileName = this.getFileName();
    this.type = this.getExtension();
    this.order = this.getOrder();
  }

  getFileName() {
    return tabNameToFileName(this.name);
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

  constructor(data) {
    _.extend(this, data);
  }

  controller(self) {
    self.moveTabsLeftThreshold = 5;

    self.insertTab = () => this.insertTab(self);
    self.removeTab = (name) => this.removeTab(self, name);
    self.editTabName = (name) => this.editTabName(self, name);
    self.activateTab = (name) => this.activateTab(self, name);
    self.shouldDisplayTooltip = (name) => this.shouldDisplayTooltip(self, name);
    self.isFile = (node) => this.isFile(self, node);
    self.isDirectory = (node) => this.isDirectory(self, node);
    self.addIntoDirectory = (path) => this.addIntoDirectory(self, path);
    self.removeDirectory = (node) => this.removeDirectory(self, node);
    self.renameDirectory = (node) => this.renameDirectory(self, node);

    this.initTreeOptions(self);

    this.$scope.$watchCollection(() => Object.keys(self.tabs), (tabNames) => {
      self.tabsObjects = this.createTabObjects(tabNames);
      this.prepareTreeStructure(self, self.tabsObjects);
      //this.$log.log(self.treeStructure);

      if (self.tabsObjects.length >= self.moveTabsLeftThreshold) {
        self.showTreeview = true;
      }
    });
  }

  initTreeOptions(self) {
    self.treeOptions = {
      nodeChildren: 'children',
      dirSelectable: false,
      injectClasses: {
        // TODO [ToDr] Very hacky
        // @see: https://github.com/wix/angular-tree-control/issues/74
        li: 'type-{{ node.ext }}',
        iExpanded: 'fa fa-fw fa-folder-open',
        iCollapsed: 'fa fa-fw fa-folder',
      }
    };
  }

  prepareTreeStructure(self, tabsObjects) {

    function newNode(name, pathPreffix, tabObject) {
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

    function createNodeAndReturnChildren(tabObject) {

      return function(currentLevel, name) {
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

    function createStructureForSingleFile(topLevel, tabObject) {
      let parts = tabObject.name.split('/');
      parts.reduce(createNodeAndReturnChildren(tabObject), {
        children: topLevel,
        pathPreffix: ''
      });

      return topLevel;
    }

    function convertStructure(input) {
      return input.reduce(createStructureForSingleFile, []);
    }

    function getAllNodes(structure) {
      return structure.reduce((memo, item) => {
        return memo.concat([item]).concat(getAllNodes(item.children));
      }, []);
    }

    function findNodeForActiveTab(nodes) {
      return _.find(nodes, {
        path: self.activeTabName 
      });
    }

    self.treeStructure = convertStructure(tabsObjects);
    self.expandedNodes = getAllNodes(self.treeStructure);
    self.selectedNode = findNodeForActiveTab(self.expandedNodes);
  }

  createTabObjects(tabNames) {
    return _.sortBy(
      tabNames
      .map((tabName) => new Tab(tabName)),
      'order');
  }

  activateTab(self, tabName) {
    self.activeTabName = tabName;
  }

  makeTab(self, path) {
    self.allTabs[path] = {
      'content': ''
    };
    self.activeTabName = path;
    self.editorUndoManager.initTab(path);
  }

  insertTab(self) {
    var name = this.promptForName('Insert new filename');
    if (!name) {
      return;
    }
    this.makeTab(self, name);
  }

  removeTab(self, tabName) {
    let sure = this.promptForRemoval(tabName);
    if (!sure) {
      return;
    }
    this.deleteTabAndFixActive(self, tabName);
  }

  makePathEdition(self, oldPath, newPath) {
    self.allTabs[newPath] = self.allTabs[oldPath];
    this.deleteTabAndFixActive(self, oldPath, newPath);
    self.editorUndoManager.initTab(newPath);
  }

  editTabName(self, tabName) {
    var newName = this.promptForName('Insert new filename', tabName);
    if (!newName || newName === tabName) {
      return;
    }
    this.makePathEdition(self, tabName, newName);
  }

  deleteTabAndFixActive(self, tabName, newName) {
    delete self.allTabs[tabName];
    self.editorUndoManager.removeTab(tabName);

    if (self.activeTabName === tabName) {
      self.activeTabName = newName || Object.keys(self.tabs)[0];
    }
  }

  // This is temporary hack!
  promptForName(textForUser, path) {
    var name = this.$window.prompt(textForUser, path ? path.replace(/\|/g, '.') : '');
    if (!name) {
      return;
    }
    return name.replace(/\./g, '|');
  }

  promptForRemoval(tabName) {
    return this.$window.confirm('Sure to remove ' + tabName.replace(/\|/g, '.') + '?');
  }

  shouldDisplayTooltip(self, path) {
    let hasLongName = path.length > 15;
    return hasLongName;
  }

  isFile(self, node) {
    var hasChildren = node.children.length > 0;
    if ( hasChildren ) {
      return false;
    }
    return true;
  }

  isDirectory(self, node) {
    return !this.isFile(self, node);
  }

  addIntoDirectory(self, path) {
    var allPath = this.promptForName('Insert new filename after directory path', path+'/');
    if ( !allPath ) {
      return;
    }
    this.makeTab(self, allPath);
  }

  getAllPaths(self, obj) {
    let paths = [];
    if (obj.isFile) {
      return [obj.path];
    }
    obj.children.forEach((child) => {
      paths = paths.concat(this.getAllPaths(self, child));
      this.$log.log('Paths', paths);
    });
    return paths;
  }

  removeDirectory(self, obj) {
    var sure = this.$window.confirm('Sure to remove directory with all its content?');
    if ( !sure ) {
      return;
    }
    var pathsToRemove = this.getAllPaths(self, obj);
    pathsToRemove.forEach((path) => {
      this.deleteTabAndFixActive(self, path);
    });
  }

  properNewPath(self, path, oldDirName, newDirName) {
    var splitedPath = path.split('/');
    var indexOfOldDirName = splitedPath.indexOf(oldDirName);
    var pathBeforeDir = splitedPath.slice(0, indexOfOldDirName).join('/');
    var pathAfterDir = splitedPath.slice(indexOfOldDirName+1, splitedPath.length).join('/');

    var newPath;
    if (pathBeforeDir.length) {
      newPath = pathBeforeDir + '/' + newDirName + '/' + pathAfterDir;
    } else {
      newPath = newDirName + '/' + pathAfterDir; 
    }
    return newPath;
  }

  renameDirectory(self, obj) {
    var oldDirName = obj.name;
    var newDirName = this.promptForName('Insert new directory name:', oldDirName);
    if ( !newDirName || newDirName === oldDirName ) {
      return;
    }
    var pathsToRename = this.getAllPaths(self, obj);
    this.$log.log('pathsToRename', pathsToRename);
    pathsToRename.forEach((path) => {
      var newPath = this.properNewPath(self, path, oldDirName, newDirName);
      var oldPath = path;
      this.makePathEdition(self, oldPath, newPath);
    });
  }

}


sliderPlugins.directive('swEditorTabs', ($log) => {

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
    templateUrl: '/static/dm-plugins/slide-workspace/editor/tabs/sw-editor-tabs.html',
    controller: function($scope, $window, $log) {
      let tabs = new SwEditorTabs({
        $scope, $window, $log
      });
      tabs.controller(this);
    }
  };

});
