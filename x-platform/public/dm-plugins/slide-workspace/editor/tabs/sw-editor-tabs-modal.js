/* jshint esnext:true,-W097 */
'use strict';

import sliderPlugins from 'slider/slider.plugins';

sliderPlugins.controller('SwEditorTabsModalCtrl', function (textForUser, oldPath, mode, $modalInstance) {
  this.textForUser = textForUser;
  this.oldPath = oldPath;
  this.path = oldPath ? oldPath.replace(/\|/g, '.') : '';
  this.mode = mode || false;

  this.ok = function (newPath) {
    newPath = newPath.replace(/\./g, '|');
    $modalInstance.close(newPath);
  };

  this.delete = function (oldPath) {
    $modalInstance.close(oldPath);
  };

  this.cancel = function () {
    $modalInstance.dismiss();
  };
});
