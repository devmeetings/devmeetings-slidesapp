import _ from '_';
import app from 'dm-dashboard/dm-dashboard-app';
import template from './dm-dashboard-index.html!text';

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

    vm.sort = {
      by: false,
      desc: false
    };

    vm.viewOptions = {
      allProblemsOnScreen: false,
      strategicView: 'table'
    };

    this.$scope.$watch(() => vm.dashboard, () => {
      vm.model = vm.dashboard;
      // czy nie powinienem zwracac?
      this.buildFinalDashboardModel(vm.model.activeEvents);
    });
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
        }else {
          resultInIteration.push(0);
        }
      }
      resultForRank.push(resultInIteration);
    }
    return {
      allGainedPoints: allGainedPoints,
      maxNumOfPointsToGain: maxNumOfPointsToGain,
      percent: Math.round((allGainedPoints / maxNumOfPointsToGain) * 10000) / 100,
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

  getBestRanks (sortedRanks, numOfBests) {
    let bestUsers = [];
    let i = 0;
    while (i < numOfBests) {
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

  getBestUsers (ranks) {
    let sortedRanks = this.sortRanksbyPercentResult(ranks);
    let numOfBests = 3;
    return this.getBestRanks(sortedRanks, numOfBests);
  }

  getWorseUsers (ranks) {
    let sortedRanks = this.sortRanksbyPercentResult(ranks);
    let numOfWorse = 3;
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
        percent: _.round(sumPercent / members, 2)
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

  isTrainer (user) {
    return _.contains(user.acl, 'trainer');
  }

  getOrganizers (ranks) {
    let organizers = [];
    for (let rank of ranks) {
      if (this.isTrainer(rank.user)) {
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
      if (!this.isTrainer(rank.user)) {
        students.all.push({
          name: rank.user.name,
          avatar: rank.user.avatar,
          percent: rank.summary.percent,
          group: rank.group
        });
        students.active.push({
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

  buildFinalDashboardModel (activeEvents) {
    for (let event of activeEvents) {
      event.ranking.ranks = this.getSummaryResultsForRanks(event);
      event.ranking.bestUsers = this.getBestUsers(event.ranking.ranks);
      event.ranking.worseUsers = this.getWorseUsers(event.ranking.ranks);
      event.ranking.bestGroup = this.getBestGroup(event.ranking.ranks);
      event.members = this.getMembers(event.ranking.ranks);
      // to clear view:
      event.ranking.ranks = undefined;
    }
    // return dashboard;
  }

}

