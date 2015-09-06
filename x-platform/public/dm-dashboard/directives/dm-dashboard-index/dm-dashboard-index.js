import _ from '_';
import app from 'dm-dashboard/dm-dashboard-app';
import template from './dm-dashboard-index.html!text';

app.directive('dmDashboardIndex', () => {
  return {
    restrict: 'E',
    replace: true,

    scope: {
      name: '='
    },
    controllerAs: 'vm',
    bindToController: true,
    controller () {
      let c = new DmDashboardIndex({});
      c.controller(this);
    },
    template: template
  };
});

class DmDashboardIndex {

  constructor (data) {
    _.extend(this, data);
  }

  controller (vm) {
    vm.greeting = 'Hi';
  }
}

