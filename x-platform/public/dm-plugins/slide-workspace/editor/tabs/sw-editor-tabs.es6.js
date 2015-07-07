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
    self.addIntoDirectory = (path) => this.addIntoDirectory(self, path);
    self.removeDirectory = (node) => this.removeDirectory(self, node);
    self.selectFilesToRemove = (node) => this.selectFilesToRemove(self, node);
    self.renameDirectory = (node) => this.renameDirectory(self, node);
    self.displayCheckbox = (path) => this.displayCheckbox(self, path);

    this.initTreeOptions(self);

    this.$scope.$watchCollection(() => Object.keys(self.tabs), (tabNames) => {
      self.tabsObjects = this.createTabObjects(tabNames);
      this.prepareTreeStructure(self, self.tabsObjects);
      this.$log.log(self.treeStructure);

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
        li: 'type-{{ node.ext }}'
      }
    };
  }

  prepareTreeStructure(self, tabsObjects) {

    function newNode(name, tabObject) {
      return {
        name: name,
        path: tabObject.name,
        ext: tabObject.type,
        fileName: tabNameToFileName(name),
        children: []
      };
    }

    function createNodeAndReturnChildren(tabObject) {

      return function(currentLevel, name) {
        var node = _.find(currentLevel, {
          name: name
        });

        if (!node) {
          node = newNode(name, tabObject);
          currentLevel.push(node);
        }

        return node.children;
      };
    }

    function createStructureForSingleFile(topLevel, tabObject) {
      let parts = tabObject.name.split('/');
      parts.reduce(createNodeAndReturnChildren(tabObject), topLevel);

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

    // So far always directory and its first child had the same path.
    // Path must be unique, because methods are taking it as main argument. 
    function removeDuplicatedPaths(obj) {
      // here must be magic!
      // OR it can be romoved if createStructureForSingleFile
      // will change 
    }

    self.treeStructure = convertStructure(tabsObjects);
    //self.treeStructure = removeDuplicatedPaths(self.treeStructure);
    self.expandedNodes = getAllNodes(self.treeStructure);
  }

  createTabObjects(tabNames) {
    return _.sortBy(
      tabNames
      .map((tabName) => new Tab(tabName)),
      'order');
  }

  activateTab(self, tabName) {
    if (self.activeTabName === tabName) {
      this.editTabName(self, tabName);
      return;
    }

    self.activeTabName = tabName;
  }

  insertTab(self) {
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

  removeTab(self, tabName) {
    let sure = this.promptForRemoval(tabName);
    if (!sure) {
      return;
    }
    this.deleteTabAndFixActive(self, tabName);
  }

  editTabName(self, tabName) {
    var newName = this.promptForName(tabName);
    if (!newName) {
      return;
    }
    self.allTabs[newName] = self.allTabs[tabName];
    this.deleteTabAndFixActive(self, tabName, newName);
    self.editorUndoManager.initTab(newName);
  }

  deleteTabAndFixActive(self, tabName, newName) {
    delete self.allTabs[tabName];
    self.editorUndoManager.removeTab(tabName);

    if (self.activeTabName === tabName) {
      self.activeTabName = newName || Object.keys(self.tabs)[0];
    }
  }

  // This is temporary hack!
  promptForName(old) {
    var name = this.$window.prompt('Insert new filename', old ? old.replace(/\|/g, '.') : '');
    if (!name) {
      return;
    }
    return name.replace(/\./g, '|');
  }

  promptForRemoval(tabName) {
    return this.$window.confirm('Sure to remove ' + tabName.replace(/\|/g, '.') + '?');
  }

  shouldDisplayTooltip(self, tabName) {
    let hasLongName = tabName.length > 15;
    return hasLongName;
  }

  isFile(self, node) {
    let hasChildren = node.children.length > 0;
    if (hasChildren) {
      return false;
    }
    return true;
  }

  addIntoDirectory(self, path) {
    var parts = path.split('/');
    var directoryPath = parts.slice(0, parts.length - 1);
    directoryPath = directoryPath.join('/') + '/';

    this.editTabName(self, directoryPath);
  }

  getAllPaths(self, obj, collection) {
    if ( typeof obj === 'object' ) {
      for ( var key in obj ) {
        if ( key === 'path' ) {
          var path = obj[key];
          collection.push(path);
        }
        if ( key === 'children' || typeof obj[key] === 'object' ) {
          this.getAllPaths(self, obj[key], collection);      
        }   
      }
    }
  }

  removeDirectory(self, obj) {
    var pathsToRemove = [];
    this.getAllPaths(self, obj, pathsToRemove);
    var sure = this.$window.confirm('Sure to remove directory with all its content?');
    if ( sure ) {
      for ( var key in pathsToRemove ) {
        var path = pathsToRemove[key];
        this.deleteTabAndFixActive(self, path);
      }
    }
  }

  selectFilesToRemove(self, obj) {
    var pathsToRemove = [];
    this.getAllPaths(self, obj, pathsToRemove);
    this.pathsToRemove = pathsToRemove;
  }

  displayCheckbox(self, path) {
    if ( this.pathsToRemove ) {
      return this.pathsToRemove.indexOf(path) > -1;
    }
  }

  renameDirectory(self, obj) {
    var newDirName = this.$window.prompt('Insert new directory name:', obj.fileName);
    if ( !newDirName ) {
      return;
    }
    var pathsToRename = [];
    this.getAllPaths(self, obj, pathsToRename);
    for ( var key in pathsToRename ) {
      var path = pathsToRename[key];
      var oldPath = path;
      var pathAfterDir = path.split('/');
      pathAfterDir = pathAfterDir.slice(1, pathAfterDir.length).join('/');
      var newPathName = newDirName + '/' + pathAfterDir;
      self.allTabs[newPathName] = self.allTabs[oldPath];
      this.deleteTabAndFixActive(self, oldPath, newPathName);
      self.editorUndoManager.initTab(newPathName);
    }
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
