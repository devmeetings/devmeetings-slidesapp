import app from 'dm-dashboard/dm-dashboard-app';
import template from './dm-dashboard-index.html!text';
import _ from '_';
import DashboardModelBuilder from './dashboard-model-builder';
import dVOperator from './dashboard-view-operator';

app.directive('dmDashboardIndex', () => {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      dashboard: '='
    },
    controllerAs: 'vm',
    bindToController: true,
    controller ($scope) {
      let c = new DmDashboardIndex({$scope});
      c.controller(this, $scope);
    },
    template: template
  };
});

class DmDashboardIndex {

  constructor (data) {
    _.extend(this, data);
  }

  controller (vm) {
    vm.dVOperator = dVOperator;
    vm.viewOptions = dVOperator.viewOptions;

    vm.getNumOfAllUnsolvedProblems = (events) => this.getNumOfAllUnsolvedProblems(events);

    this.$scope.$watch(() => vm.dashboard, () => {
      // if (!vm.dashboard) {
      //   return;
      // }
      let dashboardModelBuilder = new DashboardModelBuilder();
      vm.model = dashboardModelBuilder.buildFinalDashboardModel(vm.dashboard);
    });
  }

  getNumOfAllUnsolvedProblems (events) {
    let allProblems = 0;

    for (let event of events) {
      allProblems = allProblems + dVOperator.getNumOfUnsolvedProblems(event.reportedProblems);
    }
    return allProblems;
  }

}

