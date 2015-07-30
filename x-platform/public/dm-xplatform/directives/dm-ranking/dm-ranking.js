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
      console.log(scope.currentUser);
    });

    // scope.groups = [
    //   {
    //     name: 'a',
    //     users: [],
    //     ranks: []
    //   },
    //   {
    //     name: 'b',
    //     users: [],
    //     ranks: []
    //   },
    //   {
    //     name: 'c',
    //     users: [],
    //     ranks: []
    //   }
    // ];

    scope.removeUserFromGroups = function () {
      _.map(scope.groups, function (group) {
        _.map(group.ranks, function (rank) {
          if (rank.user._id === scope.currentUser._id) {
            let idx = group.ranks.indexOf(rank);
            group.ranks.splice(idx, 1);
            console.log(scope.groups);
          }
        });
      });
    };

    scope.userJoinToGroup = function (group) {
      group.users.push(scope.currentUser);

      console.log(scope.currentUser.name + ' joined to ' + group.name);
      console.log(scope.ranking);

      let currentUserRank = _.find(scope.ranking, function (ranking) {
        return ranking.user._id === scope.currentUser._id;
      });
      console.log(currentUserRank);

      scope.removeUserFromGroups();
      group.ranks.push(currentUserRank);

      console.log(scope.groups);
    };

    this.dmRanking.getCurrentRanking();
    scope.rankingService = this.dmRanking;

    scope.$watch('rankingService.currentRanking', (currentRanking) => {
      // Transform ranking to array
      scope.ranking = _.reduce(currentRanking, (memo, value) => {
        memo.push(value);
        return memo;
      }, []);

      // Probably temporary
      scope.groups = [
        {
          name: 'a',
          users: [],
          ranks: []
        },
        {
          name: 'b',
          users: [],
          ranks: []
        },
        {
          name: 'c',
          users: [],
          ranks: []
        }
      ];

      // Make group array with rankings
      this.generateGroupsWithRanks(scope.ranking, scope.groups);
      // console.log(scope.groups);

      this.makeGroupStructure(scope, scope.groups, scope.event);
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

  generateGroupsWithRanks (ranking, groups) {

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

  rankExist (group, item) {
    var rankFound = _.find(group.ranks, {
      _id: item._id
    });

    return !!rankFound;
  }

  // tr(ng-repeat="rank in group.ranks")
  //   td(ng-repeat="it in event.iterations")
  //     span(ng-repeat="i in getTasks(rank, $index)")
  //       span(ng-if="rank.data[$parent.$index + '_' + i].isDone")
  //         //span.fa.fa-fw.fa-check.text-success
  //         | [1 / {{ group.ranks.length }}]
  //       span(ng-if="!rank.data[$parent.$index + '_' + i].isDone")
  //         //span.fa.fa-fw.fa-minus.text-muted
  //         | [0 / {{ group.ranks.length }}]

  makeGroupStructure (scope, groups, event) {
    for (let group of groups) {
      for (let rank of group.ranks) {
        // console.log(rank.data);
        for (let it of event.iterations) {
          for (let i of scope.getTasks(rank, $index)) {
            console.log(rank.data[$parent.$index + '_' + i].isDone);
          }
        }
      }
    }
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
