/* jshint esnext:true,-W097 */
'use strict';


import sliderPlugins from 'slider/slider.plugins';
import * as _ from '_';
import getExtension from 'es6!dm-modules/dm-editor/get-extension.es6';


class Tab {

  constructor(tabName) {
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

  constructor(data) {
    _.extend(this, data);
  }

  controller(self) {
    self.moveTabsLeftThreshold = 5;

    self.insertTab = () => this.insertTab(self);
    self.removeTab = (name) => this.removeTab(self, name);
    self.editTabName = (name) => this.editTabName(self, name);
    self.activateTab = (name) => this.activateTab(self, name);
    self.isFile = (node) => this.isFile(self, node);
    self.setExtensionsAfterDots = (name) => this.setExtensionsAfterDots(self, name);
    self.insertTabIfTreeview = (path) => this.insertTabIfTreeview(self, path);
    self.removeDirectory = (node) => this.removeDirectory(self, node);

    self.shouldDisplayTooltip = (name) => this.shouldDisplayTooltip(self, name);

    this.$scope.$watchCollection(() => Object.keys(self.tabs), (tabNames) => {
      //this.$log.log( () => Object.keys(self.tabs) );\
      this.converter(self, tabNames);

      self.tabsObjects = this.createTabObjects(tabNames);
      //this.$log.log(tabNames);
      //this.$log.log(self.tabsObjects);
      //this.$log.log('Structure after conversion by Tomek\'s code:', self.structure);
      //this.$log.log('tabNames:', tabNames);
      //this.$log.log('structure:', self.structure);
      //this.$log.log('tabObjects:', self.tabsObjects);
      //self.tabsObjects = self.structure;
    });
  }

  converter(self, tabNames) {

    var tabs = [
      'www/index.html',
      'www/js/main.js',
      'www/css/style.css',
      'www/js/x.js',
      'abc.html'
    ];

    function newNode(name, path) {
      return {
        name: name,
        path: path,
        children: []
      };
    }

    function createNodeAndReturnChildren(path) {
      
      return function(currentLevel, name) {
        var node = _.find(currentLevel, {
          name: name,
        });
        
        if (!node) {
          node = newNode(name, path);
          currentLevel.push(node);
        }
        
        return node.children;
      };
    }

    function createStructureForSingleFile(topLevel, fileName) {
      
      let parts = fileName.split('/');
      let path = parts.slice(0, parts.length - 1);
      parts.reduce(createNodeAndReturnChildren(fileName), topLevel);
      
      return topLevel;
    }

    function convertStructure(input) {
      return input.reduce(createStructureForSingleFile, []);
    }

    self.structure = convertStructure(tabNames);

  }

  createTabObjects(tabNames) {
    return _.sortBy(
      tabNames
      .map((tabName) => new Tab(tabName)),
      'order');
  }

  activateTab(self, tabName) {
    this.$log.log('activTab was called');

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

  setExtensionsAfterDots(self, name) {
    return name.replace(/\|/g, '.');
  }

  promptForNameIfTreeview(self, path) {
    this.editTabName(self, path);
  }

  insertTabIfTreeview(self, path) {
    let parts = path.split('/');
    let directoryPath = parts.slice(0, parts.length - 1);
    directoryPath = directoryPath.join('/') + '/';

    this.editTabName(self, directoryPath);
  }

  removeDirectory(self, node) {
    let sure = this.$window.confirm('Sure to remove directory with all content?');
    if (!sure) {
      return;
    } 
    _.map(node.children, function(child) { 
      console.log(child);
      console.log(child.path);      
      this.deleteTabAndFixActive(self, child.path);
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

      $scope.treeOptions = {
          nodeChildren: "children",
          dirSelectable: true,
          injectClasses: {
              ul: "a1",
              li: "a2",
              liSelected: "c-liSelected",
              iExpanded: "a3",
              iCollapsed: "a4",
              iLeaf: "a5",
              label: "a6",
              labelSelected: "a8"
          }
      };
      $scope.dataForTheTree =
      [
          { "name" : "Joe", "age" : "21", "children" : [
              { "name" : "Smith", "age" : "42", "children" : [] },
              { "name" : "Gary", "age" : "21", "children" : [
                  { "name" : "Jenifer", "age" : "23", "children" : [
                      { "name" : "Dani", "age" : "32", "children" : [] },
                      { "name" : "Max", "age" : "34", "children" : [] }
                  ]}
              ]}
          ]},
          { "name" : "Albert", "age" : "33", "children" : [] },
          { "name" : "Ron", "age" : "29", "children" : [] }
      ];
    }
  };

});
