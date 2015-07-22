/* jshint esnext:true,-W097 */
'use strict';

import sliderPlugins from 'slider/slider.plugins';

sliderPlugins.controller('SwEditorTabsModalCtrl', function ($scope, textForUser, oldPath, $modalInstance) {
  $scope.textForUser = textForUser;
  $scope.path = oldPath ? oldPath.replace(/\|/g, '.') : '';

  $scope.ok = function (newPath) {
    newPath = newPath.replace(/\./g, '|');
    $modalInstance.close(newPath);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss();
  };

});
