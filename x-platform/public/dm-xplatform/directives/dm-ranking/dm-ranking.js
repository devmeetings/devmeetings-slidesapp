/* jshint esnext:true,-W097 */

'use strict';

import xplatformApp from 'dm-xplatform/xplatform-app';
import _ from '_';
import viewTemplate from './dm-ranking.html!text';

export class RankingDir {

  constructor (data) {
    _.extend(this, data);
  }

  link (scope) {
    this.dmUser.getCurrentUser().then((user) => {
      scope.currentUser = user.result;
      console.log('scope.currentUser:');
      console.log(scope.currentUser);
    });

    scope.userJoinToGroup = function (groupName) {
      let currentUserRank = _.find(scope.ranking, function (ranking) {
        return ranking.user._id === scope.currentUser._id;
      });
      currentUserRank.group = groupName;
      console.log(currentUserRank);

      // ranking uzytkownika ze zmieniana grupa leci na back-end, ktory
      // dokonuje wpisu w DB, nastepnie info o dokonanej zmianie leci do frontu(ow)
    };

    scope.createNewGroup = (newGroupName) => {

      // To jednak chyba powinno byc po back-endzie
      if (this.groupAlreadyExist(scope.groups, newGroupName) || !newGroupName) {
        return;
      }
      console.log('New group was created: ', newGroupName);
      // jak to widze:
      // na back-end zostaje wyslana nazwa nowej grupy i jesli
      // grupa z taka nazwa nie istnieje, back-end
      // dodaje do listy grup, po czym rozsyla ja do frontu, zeby uzytkownicy
      // mogli przyporzadkowac sie
    };

    this.dmRanking.getCurrentRanking();
    scope.rankingService = this.dmRanking;
    scope.rankingViews = ['Ranking (Users)', 'Ranking (Groups - aggregated)'];

    scope.$watch('rankingService.currentRanking', (currentRanking) => {
      // Transform ranking to array
      scope.ranking = _.reduce(currentRanking, (memo, value) => {
        memo.push(value);
        return memo;
      }, []);

      scope.groups = this.generateGroups(scope.ranking);
      this.populateGroupsWithRankings(scope.ranking, scope.groups);
      scope.aggregatedGroups = this.getArrWithAgreggatedGroups(scope, scope.groups, scope.event.iterations);
    });

    function findMaxNoOfTasks (iterationIdx) {
      let it = scope.event.iterations[iterationIdx];
      return it.tasks.reduce((memo, task) => {
        return memo + (task.noOfTasks || 0);
      }, 0);
    }

    scope.getTasks = function (item, iterationIdx) {
      if (!item.counts) {
        return [];
      }
      let max = item.counts[iterationIdx] || 0;
      let maxFromEvent = findMaxNoOfTasks(iterationIdx);

      return _.range(0, Math.max(maxFromEvent, max));
    };
  }

  rankExist (group, item) {
    var rankFound = _.find(group.ranks, {
      _id: item._id
    });

    return !!rankFound;
  }

  generateGroups (ranking) {
    let groups = [];

    for (let item of ranking) {
      let group = {
        name: item.group,
        ranks: []
      };

      if (!this.groupAlreadyExist(groups, group.name)) {
        groups.push(group);
      }
    }

    console.log(groups);
    return groups;
  }

  populateGroupsWithRankings (ranking, groups) {

    _.map(ranking, (item) => {
      _.map(groups, (group) => {
        if (group.name === item.group) {
          if (!group.ranks.length) {
            group.ranks.push(item);
          }else {
            if (!(this.rankExist(group, item))) {
              group.ranks.push(item);
            }
          }
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

    for (let task of tasksInIteration) {
      let id = iterationIdx + '_' + task;

      let sum = 0;
      for (let rank of ranks) {

        if (rank.data[id] && rank.data[id].isDone) {
          sum += 1;
        }
      }
      results.push(sum);
    }

    return results;
  }

  aggregateGroup (scope, group, eventIterations) {
    let results = [];

    for (let i = 0; i < eventIterations.length; i++) {
      let resultsForIteration = this.aggregateResultsForIteration(scope, group.ranks, i);
      results.push(resultsForIteration);
    }

    return {
      name: group.name,
      noOfUsers: group.ranks.length,
      results: results
    };
  }

  getArrWithAgreggatedGroups (scope, groups, eventIiterations) {
    let aggregatedGroups = [];
    for (let group of scope.groups) {
      let aggregatedGroup = this.aggregateGroup(scope, group, eventIiterations);
      aggregatedGroups.push(aggregatedGroup);
    }
    return aggregatedGroups;
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
      let contextMenu = new RankingDir({
      dmRanking, dmUser});
      contextMenu.link(scope);
    }
  };

});
