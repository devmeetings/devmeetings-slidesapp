/* jshint esnext:true,-W097 */
'use strict';

import sliderPlugins from 'slider/slider.plugins';
import _ from '_';
import viewTemplate from './sw-editor-tabs-options-dropdown.html!text';

class SwEditorTabsOptionsDropdown {

  constructor (data) {
    _.extend(this, data);
  }

  controller (self) {
    self.addIntoDirectory = (path) => this.addIntoDirectory(self, path);
    self.removeDirectory = (node) => this.removeDirectory(self, node);
    self.renameDirectory = (node) => this.renameDirectory(self, node);
  }

  addIntoDirectory (self, path) {
    var text = 'Insert new filename after directory path:';
    path = path + '/';
    self.displayModal({textForUser: text, path: path}).then((allPath) => {
      if (!allPath) {
        return;
      }
      self.makeTab({path: allPath});
    });
  }

  getAllPaths (self, obj) {
    let paths = [];
    if (obj.isFile) {
      return [obj.path];
    }
    obj.children.forEach((child) => {
      paths = paths.concat(this.getAllPaths(self, child));
    });
    return paths;
  }

  removeDirectory (self, directory) {
    var dirName = directory.name;
    var text = 'Sure to remove directory ' + dirName + ' with all its content?';
    self.displayModal({textForUser: text, path: false, mode: 'removeMode'}).then(() => {
      var pathsToRemove = this.getAllPaths(self, directory);
      pathsToRemove.forEach((path) => {
        self.deleteTabAndFixActive({path: path});
      });
    });
  }

  prepareNewPathForDirRename (self, path, oldDirPath, newDirName) {
    var pathLeft = oldDirPath.split('/');
    pathLeft = pathLeft.slice(0, pathLeft.length - 1).join('/');
    pathLeft = pathLeft.length > 0 ? pathLeft + '/' : '';
    var pathRight = path.slice(oldDirPath.length, path.length);

    var newPath = pathLeft + newDirName + pathRight;
    return newPath;
  }

  renameDirectory (self, directory) {
    var text = 'Insert new directory name:';
    var oldDirName = directory.name;
    var oldDirPath = directory.path;
    self.displayModal({textForUser: text, path: oldDirName}).then((newDirName) => {
      if (!newDirName || newDirName === oldDirName) {
        return;
      }
      var pathsToRename = this.getAllPaths(self, directory);
      pathsToRename.forEach((path) => {
        var newPath = this.prepareNewPathForDirRename(self, path, oldDirPath, newDirName);
        var oldPath = path;
        self.makePathEdition({oldPath: oldPath, newPath: newPath});
      });
    });
  }
}

sliderPlugins.directive('swEditorTabsOptionsDropdown', () => {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      node: '=',
      editTabName: '&',
      removeTab: '&',
      displayModal: '&',
      makeTab: '&',
      makePathEdition: '&',
      deleteTabAndFixActive: '&'
    },
    bindToController: true,
    controllerAs: 'model',
    template: viewTemplate,
    controller: function ($scope, $window) {
      let options = new SwEditorTabsOptionsDropdown({
        $scope, $window
      });
      options.controller(this);
    }
  };
});
