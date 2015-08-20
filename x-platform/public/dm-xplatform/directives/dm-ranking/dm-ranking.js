/* jshint esnext:true,-W097 */

'use strict';

import xplatformApp from 'dm-xplatform/xplatform-app';
import _ from '_';
import viewTemplate from './dm-ranking.html!text';

class Ranking {

  constructor (data) {
    _.extend(this, data);
  }

  link (scope) {
    this.dmUser.getCurrentUser().then((user) => {
      scope.currentUser = user.result;
    });
    scope.trainerAcl = 2;
    this.dmRanking.getCurrentRanking();
    scope.rankingService = this.dmRanking;
    scope.rankingViews = ['Users Ranking', 'Groups Ranking'];
    scope.alerts = [];
    scope.model = {
      currentRankingView: scope.rankingViews[1],
      showUsersDetailsinGroup: [],
      representateAsChecks: true
    };

    scope.$watch('rankingService.currentRanking', (currentRanking) => {
      // sugestia - zeby watch nie odpalal czesciej niz np. co 5-10s
      // Transform ranking to array
      scope.ranking = _.reduce(currentRanking, (memo, value) => {
        memo.push(value);
        return memo;
      }, []);
      scope.ranking = this.countUserResults(scope.ranking);
      scope.groups = this.generateGroups(scope.ranking);
      this.populateGroupsWithRankings(scope.ranking, scope.groups);
      scope.aggregatedGroups = this.getArrWithAgreggatedGroups(scope, scope.groups, scope.event.iterations);
      scope.currentUser.group = this.getCurrentUserGroup(scope.currentUser, scope.ranking);
      scope.theBestGroup = this.getTheBestGroup(scope.aggregatedGroups);
      scope.getTheBestUserRank = this.getTheBestUserRank(scope.ranking);
    });

    scope.getTasks = (item, iterationIdx) => {

      if (!item.counts) {
        return [];
      }
      let max = item.counts[iterationIdx] || 0;
      let maxFromEvent = this.findMaxNoOfTasks(scope.event.iterations, iterationIdx);

      return _.range(0, Math.max(maxFromEvent, max));
    };

    scope.properForTooltip = function (doneBy) {

      if (!(scope.currentUser.acl.length >= scope.trainerAcl)) {
        return;
      }
      let users = '';
      for (let user of doneBy) {
        users = users + '\n' + user;
      }
      return users;
    };

    scope.userJoinToGroup = (groupName) => {
      let currentUserRank = this.getCurrentUserRank(scope.ranking, scope.currentUser._id);
      currentUserRank.group = groupName;
      // TODO BACK-END
      //
      // ranking uzytkownika ze zmieniana grupa leci na back-end, ktory
      // dokonuje wpisu w DB, nastepnie info o dokonanej zmianie leci do frontu
    };

    scope.createNewGroup = (newGroupName) => {

      if (!newGroupName) {
        scope.alerts.push({type: 'warrning', msg: 'No idea how to name group? Be creative!'});
        return;
      }
      if (this.groupAlreadyExist(scope.groups, newGroupName)) {
        scope.alerts.push({type: 'warrning', msg: 'Group with this name already exist!'});
        return;
      }

      let currentUserRank = this.getCurrentUserRank(scope.ranking, scope.currentUser._id);
      currentUserRank.group = newGroupName;
      // TODO BACK-END
      //
      // w skrocie:
      // uzytkownik tworzy grupe automatycznie dodajac sie do niej po zatwierdzeniu nazwy
      //
      // rozwiniecie:
      // ranking uzytkownika z nowa grupa leci na back-end, ktory
      // dokonuje wpisu w DB, nastepnie info o dokonanej zmianie leci do frontu
      // (informacje o tym ze grupa istnieje sa przechowywane w rankingu eventu z rankami userow, wiec
      // na tej podstawie po froncie bedziemy miec nowa grupe, do ktorej inni userzy beda mogli sie dodac)
    };

    scope.closeAlert = function (index) {
      scope.alerts.splice(index, 1);
    };

  }

  findMaxNoOfTasks (eventIterations, iterationIdx) {
    let it = eventIterations[iterationIdx];
    return it.tasks.reduce((memo, task) => {
      return memo + (task.noOfTasks || 0);
    }, 0);
  }

  generateGroups (ranking) {
    let groups = [];

    for (let item of ranking) {
      if (item.group) {
        let group = {
          name: item.group,
          ranks: []
        };

        if (!this.groupAlreadyExist(groups, group.name)) {
          groups.push(group);
        }
      }
    }
    return groups;
  }

  populateGroupsWithRankings (ranking, groups) {

    _.map(ranking, (item) => {
      _.map(groups, (group) => {
        if (item.group && item.group === group.name) {
          group.ranks.push(item);
        }
      });
    });
  }

  groupAlreadyExist (groups, newGroupName) {

    for (let group of groups) {
      if (group.name === newGroupName) {
        return true;
      }
    }
    return false;
  }

  aggregateResultsForIteration (scope, ranks, iterationIdx) {
    let results = [];
    let tasksInIteration = scope.getTasks(ranks[0], iterationIdx);
    let allGainedPoints = 0;
    let maxNumOfPointsToGain = 0;

    for (let task of tasksInIteration) {
      let id = iterationIdx + '_' + task;
      let sum = 0;
      let doneBy = [];

      for (let rank of ranks) {

        if (rank.data[id] && rank.data[id].isDone) {
          sum += 1;
          allGainedPoints += 1;
          doneBy.push(rank.user.name);
        }
        maxNumOfPointsToGain += 1;
      }

      results.push({
        result: sum,
        doneBy: doneBy
      });
    }

    return {
      results: results,
      allGainedPoints: allGainedPoints,
      maxNumOfPointsToGain: maxNumOfPointsToGain
    };
  }

  aggregateGroup (scope, group, eventIterations) {
    let results = [];
    let users = [];
    let allGainedPoints = 0;
    let maxNumOfPointsToGain = 0;

    for (let i = 0; i < eventIterations.length; i++) {
      let result = this.aggregateResultsForIteration(scope, group.ranks, i);
      let resultsForIteration = result.results;
      allGainedPoints += result.allGainedPoints;
      maxNumOfPointsToGain += result.maxNumOfPointsToGain;
      results.push(resultsForIteration);
    }

    for (let rank of group.ranks) {
      users.push(rank.user);
    }

    let resultSummary = {
      allGainedPoints: allGainedPoints,
      maxNumOfPointsToGain: maxNumOfPointsToGain,
      percentageResult: Math.round((allGainedPoints / maxNumOfPointsToGain) * 10000) / 100
    };

    return {
      name: group.name,
      noOfUsers: group.ranks.length,
      users: users,
      results: results,
      resultSummary: resultSummary
    };
  }

  getArrWithAgreggatedGroups (scope, groups, eventIterations) {
    let aggregatedGroups = [];

    for (let group of groups) {
      let aggregatedGroup = this.aggregateGroup(scope, group, eventIterations);
      aggregatedGroups.push(aggregatedGroup);
    }
    return aggregatedGroups;
  }

  getCurrentUserGroup (currentUser, ranking) {

    for (let rank of ranking) {
      if (currentUser._id === rank.user._id) {
        return rank.group;
      }
    }
  }

  countUserResults (ranking) {

    for (let rank of ranking) {
      let result = 0;
      _.forIn(rank.data, function (value, key) {
        if (value.isDone) {
          result += 1;
        }
      });
      rank.result = result;
    }
    return ranking;
  }

  getTheBestGroup (groups) {
    return _.max(groups, function (group) {
      return group.resultSummary.percentageResult;
    });
  }
  getTheBestUserRank (ranking) {
    return _.max(ranking, function (rank) {
      return rank.result;
    });
  }

  getCurrentUserRank (ranking, currentUserId) {
    return _.find(ranking, function (ranking) {
      return ranking.user._id === currentUserId;
    });
  }

}

xplatformApp.directive('dmRanking', (dmRanking, dmUser) => {

  return {
    restrict: 'E',
    replace: true,
    scope: {
      event: '='
    },
    template: viewTemplate,
    link: (scope) => {
      let contextMenu = new Ranking({
      dmRanking, dmUser});
      contextMenu.link(scope);
    }
  };

});

