import _ from '_';
import app from 'dm-dashboard/dm-dashboard-app';
import template from './dm-dashboard-problems-all.html!text';

app.directive('dmDashboardProblemsAll', () => {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      model: '=',
      viewOptions: '='
    },
    controllerAs: 'vm',
    bindToController: true,
    controller ($scope) {
      let c = new DmDashboardProblemsAll({$scope});
      c.controller(this, $scope);
    },
    template: template
  };
});

class DmDashboardProblemsAll {

  constructor (data) {
    _.extend(this, data);
  }

  controller (vm) {
  }

}
