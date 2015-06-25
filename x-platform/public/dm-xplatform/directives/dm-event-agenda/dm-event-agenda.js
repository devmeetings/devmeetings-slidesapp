/* jshint esnext:true,-W097 */

'use strict';

import xplatformApp from 'dm-xplatform/xplatform-app';
import _ from '_';
import 'dm-xplatform/directives/dm-event-task-details/dm-event-task-details';
import viewTemplate from './dm-event-agenda.html!text';

class EventAgenda {

  constructor( data) {
    _.extend(this, data);
  }

  link( scope) {
    let $state = this.$state;
    let $stateParams = this.$stateParams;

    function fixActiveTask () {
      if ($state.$current.name !== 'index.space.learn.workspace.task') {
        scope.activeTask = null;
        return;
      }
      let iterationIdx = $stateParams.iteration;
      let taskIdx = $stateParams.todo;

      if (!scope.tasks) {
        return;
      }

      scope.activeTask = scope.tasks[iterationIdx][taskIdx];
    }

    function fixActiveMaterial () {
      if ($state.$current.name !== 'index.space.learn.player') {
        scope.activeMaterial = null;
        return;
      }
      let iterationIdx = $stateParams.iteration;
      let materialId = $stateParams.material;

      let iteration = scope.event.iterations[iterationIdx];
      if (!iteration) {
        return;
      }

      scope.activeMaterial = iteration.materials.reduce(function (found, material) {
        if (found) {
          return found;
        }

        if (material._id === materialId) {
          material.iterationIdx = iterationIdx;
          return material;
        }

      }, null);
    }

    scope.$watch(() => {
      var params = ['iteration', 'todo'];
      return $state.$current.name + params.reduce((memo, param) => {
          return memo + ',' + param + ':' + this.$stateParams[param];
        }, '');
    }, () => {
      fixActiveMaterial();
      fixActiveTask();
    });

    scope.$watch('event', (event) => {
      scope.tasks = event.iterations.map((it, itIdx) => {
        return it.tasks.reduce((memo, task) => {
          let tasks = _.range(task.noOfTasks || 1).map(id => {
            return {
              iterationIdx: itIdx,
              idx: memo.length + id,
              title: task.title + (id + 1),
              url: task.url + '?task=' + id
            };
          });
          return memo.concat(tasks);
        }, []);
      });
      fixActiveTask();
    });

    this.$rootScope.onEditModeSave(scope, () => {
      this.dmEvents.editEvent(scope.event);
    });

    this.initTaskDetails(scope);
  }

  initTaskDetails( scope) {
    scope.ranking = this.dmRanking;
    scope.$watch('ranking.currentRanking', () => {
      this.dmRanking.getCurrentRankingForUser().then(function (ranking) {
        scope.userRanking = ranking;
      });
    });

    scope.isDone = (task) => {
      if (!scope.userRanking) {
        return;
      }
      let ranking = scope.userRanking[task.iterationIdx + '_' + task.idx];
      if (!ranking) {
        return false;
      }
      return ranking.isDone;
    };
    scope.markAsDone = (task) => {
      let isDone = scope.isDone(task);
      this.dmRanking.markAsDone(task.iterationIdx, task.idx, !isDone, 0);
    };
  }

}

xplatformApp.directive('dmEventAgenda', ($rootScope, $state, $stateParams, dmEvents, dmRanking) => {

  return {
    restrict: 'E',
    replace: true,
    scope: {
      event: '=',
      userWorkspaceId: '='
    },
    template: viewTemplate,
    link( scope, element) {
      let eventMenu = new EventAgenda({
      $rootScope, $stateParams, $state, dmEvents, dmRanking});
      eventMenu.link(scope, element);
    }
  };

});
