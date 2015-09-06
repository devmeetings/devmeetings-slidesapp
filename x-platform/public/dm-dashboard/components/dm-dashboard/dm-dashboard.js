'use strict';

import template from './dm-dashboard.html!text';

export class DmDashboard {

  constructor (Sockets, $scope) {
    this.Sockets = Sockets;
    this.$scope = $scope;

    this.name = 'World';

    this.initializeSockets();
  }

  initializeSockets () {
    this.Sockets.emit('dashboard.fetch', {}, (dashboard) => {
      this.$scope.$apply(() => {
        this.onDashboard(dashboard);
      });
    });
  }

  onDashboard (dashboard) {
    this.dashboard = dashboard;
  }

}

DmDashboard.as = 'vm';
DmDashboard.tpl = template;
