import app from 'dm-dashboard/dm-dashboard-app';
import template from './dm-dashboard-index.html!text';
import _ from '_';
import moment from 'moment';

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
      }
    };

    this.$scope.$watch(() => vm.dashboard, () => {
      if (!vm.dashboard) {
        return;
      }
      vm.model = this.buildFinalDashboardModel(vm.dashboard);
    });

    console.log('moment', moment());
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

  getPercentages (numOfActvStudents, numOfAllStudents) {
    return Math.round((numOfActvStudents / numOfAllStudents * 100) * 100) / 100;
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

  getTasks (rank, iterationIdx, eventIterations) {
    if (!rank.counts) {
      return [];
    }
    let max = rank.counts[iterationIdx] || 0;
    let maxFromEvent = this.findMaxNoOfTasks(eventIterations, iterationIdx);

    return _.range(0, Math.max(maxFromEvent, max));
  }

  findMaxNoOfTasks (eventIterations, iterationIdx) {
    let it = eventIterations[iterationIdx];
    return it.tasks.reduce(function (memo, task) {
      return memo + (task.noOfTasks || 0);
    }, 0);
  }

  getSummaryResultForRank (iterations, rank) {
    let resultForRank = [];
    let maxNumOfPointsToGain = 0;
    let allGainedPoints = 0;

    for (let iterationIdx in iterations) {
      let tasksInIteration = this.getTasks(rank, iterationIdx, iterations);
      let resultInIteration = [];

      for (let task of tasksInIteration) {
        let id = iterationIdx + '_' + task;
        maxNumOfPointsToGain += 1;

        if (rank.data[id] && rank.data[id].isDone) {
          allGainedPoints += 1;
          resultInIteration.push(1);
        } else {
          resultInIteration.push(0);
        }
      }
      resultForRank.push(resultInIteration);
    }
    return {
      allGainedPoints: allGainedPoints,
      maxNumOfPointsToGain: maxNumOfPointsToGain,
      percent: Math.round((allGainedPoints / maxNumOfPointsToGain * 100) * 100) / 100,
      tasks: resultForRank
    };
  }

  getSummaryResultsForRanks (event) {
    let iterations = event.iterations;
    let ranks = event.ranking.ranks;

    for (let rank of ranks) {
      rank.summary = this.getSummaryResultForRank(iterations, rank);
    }
    return ranks;
  }

  sortRanksbyPercentResult (ranks) {
    return _.sortBy(ranks, 'summary.percent');
  }

  getBestRanks (sortedRanks, numOfBest) {
    let bestUsers = [];
    let i = 0;
    while (i < numOfBest) {
      i++;
      bestUsers.push(sortedRanks[sortedRanks.length - i]);
    }
    return bestUsers;
  }

  getWorseRanks (sortedRanks, numOfWorse) {
    let worseUsers = [];
    let i = 0;
    while (i < numOfWorse) {
      worseUsers.push(sortedRanks[i]);
      i++;
    }
    return worseUsers;
  }

  getNumOfUsersToDisplayInRankRows (ranks) {
    let defaultNum = 8;
    if (ranks.length <= defaultNum) {
      return Math.round(ranks.length / 2);
    }
    return Math.round(defaultNum / 2);
  }

  getBestUsers (ranks) {
    let sortedRanks = this.sortRanksbyPercentResult(ranks);
    let numOfBest = this.getNumOfUsersToDisplayInRankRows(ranks);
    return this.getBestRanks(sortedRanks, numOfBest);
  }

  getWorseUsers (ranks) {
    ranks = ranks.filter(this.isNotTrainer, this);
    let sortedRanks = this.sortRanksbyPercentResult(ranks);
    let numOfWorse = this.getNumOfUsersToDisplayInRankRows(ranks);
    return this.getWorseRanks(sortedRanks, numOfWorse);
  }

  aggregateGroups (ranks) {
    let groups = _.groupBy(ranks, 'group');
    let groupsNames = Object.keys(groups);
    let aggregatedGroups = [];

    for (let groupName of groupsNames) {
      let sumPercent = 0;
      let members = 0;
      for (let rank of groups[groupName]) {
        sumPercent = sumPercent + rank.summary.percent;
        members++;
      }
      aggregatedGroups.push({
        name: groupName,
        percent: Math.round(sumPercent / members * 100) / 100
      });
    }

    return aggregatedGroups;
  }

  getBestGroup (ranks) {
    let aggregatedGroups = this.aggregateGroups(ranks);

    return _.max(aggregatedGroups, function (group) {
      return group.percent;
    });
  }

  isTrainer (rank) {
    return _.contains(rank.user.acl, 'trainer');
  }

  isNotTrainer (rank) {
    return !this.isTrainer(rank);
  }

  getOrganizers (ranks) {
    let organizers = [];
    for (let rank of ranks) {
      if (this.isTrainer(rank)) {
        organizers.push({
          name: rank.user.name,
          avatar: rank.user.avatar
        });
      }
    }
    return organizers;
  }

  getStudents (ranks) {
    let students = {
      all: [],
      active: []
    };
    for (let rank of ranks) {
      if (this.isNotTrainer(rank)) {
        students.all.push({
          name: rank.user.name,
          avatar: rank.user.avatar,
          percent: rank.summary.percent,
          group: rank.group
        });
      }
    }
    return students;
  }

  getMembers (ranks) {
    let number = ranks.length;
    let organizers = this.getOrganizers(ranks);
    let students = this.getStudents(ranks);

    let members = {
      number: number,
      organizers: organizers,
      students: students
    };
    return members;
  }

  buildFinalDashboardModel (dashboard) {
    for (let event of dashboard.activeEvents) {
      event.ranking.ranks = this.getSummaryResultsForRanks(event);
      event.ranking.bestUsers = this.getBestUsers(event.ranking.ranks);
      event.ranking.worseUsers = this.getWorseUsers(event.ranking.ranks);
      event.ranking.bestGroup = this.getBestGroup(event.ranking.ranks);
      event.members = this.getMembers(event.ranking.ranks);
      // to clear view:
      event.ranking.ranks = undefined;
    }
    return dashboard;
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
    if (!expectedEnd) {
      return false;
    }
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

