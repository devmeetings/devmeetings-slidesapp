/* jshint esnext:true,-W097 */
'use strict';

import xplatformApp from 'dm-xplatform/xplatform-app';

function agendaCtrl ($scope, $state, $stateParams, $location, dmBrowserTab, dmEvents) {
  dmBrowserTab.setTitleAndIcon('Agenda', 'slide');

  var port = $location.port();
  port = port !== 443 && port !== 80 ? ':' + port : '';
  $scope.url = '//' + $location.host() + port;

  $scope.cloneEvent = function () {
    dmEvents.cloneEvent($scope.event).then(function (event) {
      $state.go('index.space.learn.agenda', {
        event: event._id
      });
    });
  };
}

xplatformApp.controller('dmXplatformAgenda', agendaCtrl);
