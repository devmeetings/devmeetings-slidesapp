import _ from '_';
import app from 'dm-dashboard/dm-dashboard-app';
import template from './dm-dashboard-tiles.html!text';

app.directive('dmDashboardTiles', () => {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      dashboard: '=',
      allProblemsOnScreen: '='
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
    vm.getAllEventsNum = () => this.getAllEventsNum(vm);
    vm.getAllPeopleNum = () => this.getAllPeopleNum(vm);
  }

  getAllEventsNum (vm) {
    let allEventsNum = 0;
    for (let event of vm.dashboard.activeEvents) {
      allEventsNum++;
    }
    return allEventsNum;
  }

  getAllPeopleNum (vm) {
    let allPeopleNum = 0;
    for (let event of vm.dashboard.activeEvents) {
      allPeopleNum = allPeopleNum + event.members.number;
    }
    return allPeopleNum;
  }

}
