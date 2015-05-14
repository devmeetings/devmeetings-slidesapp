/* jshint esnext:true,-W097 */
'use strict';

import * as xplatformApp from 'xplatform/xplatform-app';

function agendaCtrl($scope, $state, $stateParams, $location, dmBrowserTab, dmEvents, dmIntro) {
  dmBrowserTab.setTitleAndIcon('Agenda', 'slide');
  dmIntro.startIfFirstTime('agenda');

  var port = $location.port();
  port = port !== 443 && port !== 80 ? ':' + port : '';
  $scope.url = '//' + $location.host() + port;

  $scope.cloneEvent = function() {
    dmEvents.cloneEvent($scope.event).then(function(event) {
      $state.go('index.space.agenda', {
        event: event._id
      });
    });
  };
}

xplatformApp.controller('dmXplatformAgenda', agendaCtrl);
