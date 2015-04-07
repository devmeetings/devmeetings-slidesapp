/* jshint esnext:true,-W097 */
'use strict';

import * as xplatformApp from 'xplatform/xplatform-app';

function agendaCtrl($scope, $stateParams, dmBrowserTab) {
  dmBrowserTab.setTitleAndIcon('Agenda', 'slide');

  $scope.toggleRight(true);
}

xplatformApp.controller('dmXplatformAgenda', agendaCtrl);
