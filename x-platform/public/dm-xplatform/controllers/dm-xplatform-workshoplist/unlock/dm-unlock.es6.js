/* jshint esnext:true,-W097 */
'use strict';

import xplatformApp from 'dm-xplatform/xplatform-app';

xplatformApp.controller('dmXplatformWorkshopUnlock', function ($scope, course, dmEvents, $modalInstance) {
  $scope.course = course;

  $scope.onUnlock = (pin) => {
    dmEvents.getRealId(course._id, pin).then(function (realId) {
      course._id = realId;
      delete course.pin;
      $modalInstance.close(realId);
    }, function () {
      $scope.wrongPin = true;
    });
  };

});
