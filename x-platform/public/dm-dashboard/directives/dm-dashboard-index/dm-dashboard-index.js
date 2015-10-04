import app from 'dm-dashboard/dm-dashboard-app';
import template from './dm-dashboard-index.html!text';
import _ from '_';
import moment from 'moment';
import DashboardModelBuilder from './dashboard-model-builder';

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
    vm.getNumOfUnsolvedProblems = (reportedProblems) => this.getNumOfUnsolvedProblems(reportedProblems);
    vm.getPercentages = (numOfActvStudents, numOfAllStudents) => this.getPercentages(numOfActvStudents, numOfAllStudents);
    vm.getNumOfAllUnsolvedProblems = (events) => this.getNumOfAllUnsolvedProblems(events);
    vm.sortBy = (byWhat) => this.sortBy(vm, byWhat);
    vm.isFullscreen = (eventId) => this.isFullscreen(vm, eventId);
    vm.toggleEventDetailedView = (eventId) => this.toggleEventDetailedView(vm, eventId);
    vm.referToExpectedEndDate = (expectedEnd) => this.referToExpectedEndDate(expectedEnd);

    vm.sort = {
      by: false,
      desc: false
    };

    vm.viewOptions = {
      allProblemsOnScreen: false,
      strategicView: 'table',
      fullscreenEvent: {
        _id: undefined
      },
      showTiles: true
    };

    this.$scope.$watch(() => vm.dashboard, () => {
      if (!vm.dashboard) {
        return;
      }
      let dashboardModelBuilder = new DashboardModelBuilder();
      vm.model = dashboardModelBuilder.buildFinalDashboardModel(vm.dashboard);
    });
  }

  getPercentages (numOfActvStudents, numOfAllStudents) {
    return Math.round((numOfActvStudents / numOfAllStudents * 100) * 100) / 100;
  }

  getNumOfUnsolvedProblems (reportedProblems) {
    let numOfUnsolvedProblems = 0;

    for (let problem of reportedProblems) {
      if (!problem.solved) {
        numOfUnsolvedProblems++;
      }
    }
    return numOfUnsolvedProblems;
  }

  getNumOfAllUnsolvedProblems (events) {
    let allProblems = 0;

    for (let event of events) {
      allProblems = allProblems + this.getNumOfUnsolvedProblems(event.reportedProblems);
    }
    return allProblems;
  }

  sortBy (vm, byWhat) {
    vm.sort.by = byWhat;
    vm.sort.desc = !vm.sort.desc;
  }

  isFullscreen (vm, eventId) {
    return eventId === vm.viewOptions.fullscreenEvent._id;
  }

  toggleEventDetailedView (vm, eventId) {
    if (this.isFullscreen(vm, eventId)) {
      vm.viewOptions.fullscreenEvent._id = false;
    } else {
      vm.viewOptions.fullscreenEvent._id = eventId;
    }
  }

  minutesAfterExpectedEndDate (expectedEnd) {
    let now = moment();
    let difference = now.diff(expectedEnd, 'minutes');
    return difference;
  }

  referToExpectedEndDate (expectedEnd) {
    if (!expectedEnd) {
      return 'ended';
    }

    let minutesAfterExpectedEndDate = this.minutesAfterExpectedEndDate(expectedEnd);

    if (minutesAfterExpectedEndDate) {
      if (minutesAfterExpectedEndDate < 60) {
        return minutesAfterExpectedEndDate + 'min. after expected end';
      } else {
        return 'ended';
      }
    }

    return moment(expectedEnd).format('HH:mm');
  }

}

