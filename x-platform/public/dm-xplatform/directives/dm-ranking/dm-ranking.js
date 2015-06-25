/* jshint esnext:true,-W097 */

'use strict';

import xplatformApp from 'dm-xplatform/xplatform-app';
import _ from '_';
import viewTemplate from './dm-ranking.html!text';

class RankingDir {

  constructor (data) {
    _.extend(this, data);
  }

  link (scope) {
    this.dmRanking.getCurrentRanking();
    scope.rankingService = this.dmRanking;

    scope.$watch('rankingService.currentRanking', (currentRanking) => {
      // Transform ranking to array
      scope.ranking = _.reduce(currentRanking, (memo, value) => {
        memo.push(value);
        return memo;
      }, []);
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

}

xplatformApp.directive('dmRanking', (dmRanking) => {

  return {
    restrict: 'E',
    replace: true,
    scope: {
      event: '='
    },
    template: viewTemplate,
    link: (scope) => {
      let contextMenu = new RankingDir({
      dmRanking});
      contextMenu.link(scope);
    }
  };

});
