import _ from '_';
import app from 'dm-dashboard/dm-dashboard-app';
import template from './dm-dashboard-strategic-table-view.html!text';

app.directive('dmDashboardStrategicTableView', () => {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      model: '=',
      viewOptions: '=',
      dashboardViewOperator: '='
    },
    controllerAs: 'vm',
    bindToController: true,
    controller ($scope) {
      let c = new DmDashboardStrategicTableView({$scope});
      c.controller(this, $scope);
    },
    template: template
  };
});

class DmDashboardStrategicTableView {

  constructor (data) {
    _.extend(this, data);
  }

  controller (vm) {
    let dVOperator = vm.dashboardViewOperator;
    vm.toggleEventDetailedView = (eventId) => dVOperator.toggleEventDetailedView(vm, eventId);
    vm.getPercentages = (numOfActvStudents, numOfAllStudents) => dVOperator.getPercentages(numOfActvStudents, numOfAllStudents);
    vm.getNumOfUnsolvedProblems = (reportedProblems) => dVOperator.getNumOfUnsolvedProblems(reportedProblems);
    vm.referToExpectedEndDate = (expectedEnd) => dVOperator.referToExpectedEndDate(expectedEnd);
    vm.sortBy = (byWhat) => this.sortBy(vm, byWhat);
  }

  sortBy (vm, byWhat) {
    vm.viewOptions.sort.by = byWhat;
    vm.viewOptions.sort.desc = !vm.viewOptions.sort.desc;
  }

}

