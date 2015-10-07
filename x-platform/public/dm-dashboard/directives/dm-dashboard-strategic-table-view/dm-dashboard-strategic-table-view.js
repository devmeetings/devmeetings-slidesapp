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
    console.log('from strategic view');
    console.log(vm.model);
    console.log(vm.viewOptions);

    // let's create shorter name
    let vOp = vm.dashboardViewOperator;

    vm.isFullscreen = (eventId) => vOp.isFullscreen(vm, eventId);
    vm.toggleEventDetailedView = (eventId) => vOp.toggleEventDetailedView(vm, eventId);
    vm.sortBy = (byWhat) => vOp.sortBy(vm, byWhat);
  }

}

