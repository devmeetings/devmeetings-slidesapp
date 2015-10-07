import _ from '_';
import app from 'dm-dashboard/dm-dashboard-app';
import template from './dm-dashboard-problems.html!text';

app.directive('dmDashboardProblems', () => {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      event: '='
    },
    controllerAs: 'vm',
    bindToController: true,
    controller ($scope) {
      let c = new DmDashboardProblems({$scope});
      c.controller(this, $scope);
    },
    template: template
  };
});

class DmDashboardProblems {

  constructor (data) {
    _.extend(this, data);
  }

  controller (vm) {
  }

}

