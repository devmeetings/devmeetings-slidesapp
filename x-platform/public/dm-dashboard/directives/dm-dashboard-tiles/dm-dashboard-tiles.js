import _ from '_';
import app from 'dm-dashboard/dm-dashboard-app';
import template from './dm-dashboard-tiles.html!text';

app.directive('dmDashboardTiles', () => {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      dashboard: '='
    },
    controllerAs: 'vm',
    bindToController: true,
    controller ($scope) {
      let c = new DmDashboardTiles({$scope});
      c.controller(this, $scope);
    },
    template: template
  };
});

class DmDashboardTiles {

  constructor (data) {
    _.extend(this, data);
  }

  controller (vm) {
  }

}

