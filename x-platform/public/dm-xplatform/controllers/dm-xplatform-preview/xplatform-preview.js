'use strict';

import xplatformApp from 'dm-xplatform/xplatform-app';

function previewCtrl ($scope, $stateParams, $timeout) {
  $scope.workspaceId = $stateParams.workspaceId;
  $scope.baseUrl = '/api/workspace/page/' + $scope.workspaceId;
  $scope.currentPath = '/';
  $scope.appliedPath = '/';
  $scope.devicesA = {
    show: true,
    hideControls: true,
    active: 'phone',
    scale: 0.8
  };
  $scope.devicesB = {
    show: true,
    hideControls: true,
    active: 'tablet'
  };
  $scope.devicesC = {
    show: true,
    hideControls: true,
    active: 'desktop'
  };
  $scope.devicesD = {
    show: false
  };
  $scope.output = {
    topSize2: '10%',
    bottomSize2: 'calc(90% - 3px)'
  };
  $timeout(function () {
    $scope.$broadcast('refreshUrl');
  });
}

xplatformApp.controller('XplatformPreviewCtrl', previewCtrl);
