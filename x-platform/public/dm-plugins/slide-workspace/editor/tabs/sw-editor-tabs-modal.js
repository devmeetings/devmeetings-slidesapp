/* jshint esnext:true,-W097 */
'use strict';

import sliderPlugins from 'slider/slider.plugins';

sliderPlugins.controller('SwEditorTabsModalCtrl', function ($scope, textForUser, oldPath, mode, $modalInstance) {
  $scope.textForUser = textForUser;
  $scope.oldPath = oldPath;
  $scope.path = oldPath ? oldPath.replace(/\|/g, '.') : '';
  $scope.mode = mode ? mode : false;

  $scope.ok = function (newPath) {
    newPath = newPath.replace(/\./g, '|');
    $modalInstance.close(newPath);
  };

  $scope.delete = function (oldPath) {
    $modalInstance.close(oldPath);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss();
  };

});
