/* jshint esnext:true,-W097 */
'use strict';

import * as xplatformApp from 'xplatform/xplatform-app';

function historyCtrl($scope, $stateParams, dmBrowserTab) {
  $scope.historyId = $stateParams.historyId;
  $scope.eventId = $stateParams.event;
  dmBrowserTab.setTitleAndIcon('History', 'slide');
}

xplatformApp.controller('dmXplatformHistory', historyCtrl);
