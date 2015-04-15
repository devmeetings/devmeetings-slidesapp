/* jshint esnext:true,-W097 */
'use strict';

import * as xplatformApp from 'xplatform/xplatform-app';
import 'es6!xplatform/directives/dm-event-menu/dm-event-menu';

function agendaCtrl($scope, $state, $stateParams, $location, dmBrowserTab, dmEvents) {
  dmBrowserTab.setTitleAndIcon('Agenda', 'slide');


  var port = $location.port();
  port = port !== 443 && port !== 80 ? ':' + port : '';
  $scope.url = '//' + $location.host() + port;


  $scope.onEditModeSave(function() {
    dmEvents.editEvent($scope.event);
  });

  $scope.cloneEvent = function() {
    dmEvents.cloneEvent($scope.event).then(function(event) {
      $state.go('index.space.agenda', {
        event: event._id
      });
    });
  };
}

xplatformApp.controller('dmXplatformAgenda', agendaCtrl);
