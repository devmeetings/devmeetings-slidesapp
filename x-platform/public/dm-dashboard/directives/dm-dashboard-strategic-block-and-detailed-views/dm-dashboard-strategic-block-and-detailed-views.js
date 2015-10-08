import _ from '_';
import app from 'dm-dashboard/dm-dashboard-app';
import template from './dm-dashboard-strategic-block-and-detailed-views.html!text';

app.directive('dmDashboardStrategicBlockAndDetailedViews', () => {
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
      let c = new DmDashboardStrategicBlockAndDetailedViews({$scope});
      c.controller(this, $scope);
    },
    template: template
  };
});

class DmDashboardStrategicBlockAndDetailedViews {

  constructor (data) {
    _.extend(this, data);
  }

  controller (vm) {
  }

}
