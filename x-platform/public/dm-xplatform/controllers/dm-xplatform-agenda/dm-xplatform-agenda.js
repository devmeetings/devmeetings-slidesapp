/* jshint esnext:true,-W097 */
'use strict';

import * as xplatformApp from 'xplatform/xplatform-app';
import 'es6!xplatform/directives/dm-event-menu/dm-event-menu';

function agendaCtrl($scope, $stateParams, $location, dmBrowserTab) {
  dmBrowserTab.setTitleAndIcon('Agenda', 'slide');


  var port = $location.port();
  port = port !== 443 && port !== 80 ? ':' + port : '';
  $scope.url = '//' + $location.host() + port;
}

xplatformApp.controller('dmXplatformAgenda', agendaCtrl);
