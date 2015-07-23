/* jshint esnext:true,-W097 */

'use strict';

import xplatformApp from 'dm-xplatform/xplatform-app';
import _ from '_';
import viewTemplate from './dm-event-menu.html!text';

class EventMenu {

  constructor (data) {
    _.extend(this, data);
  }

  link (scope, element) {
    scope.iteration = {
      active: {},
      currentIdx: 0,
      currentTaskIdx: 0
    };

    scope.$watch('activeIteration', (idx) => {
      if (!idx) {
        return;
      }
      scope.iteration.currentIdx = parseInt(idx, 10);
    });

    scope.$watch('iteration.currentIdx', (idx) => {
      scope.iteration.active = scope.event.iterations[idx];
      scope.iteration.currentTaskIdx = 0;

      let task = scope.iteration.active.tasks[0];
      if (task) {
        scope.taskUrl = task.url;
      } else {
        scope.taskUrl = null;
      }

    });
    scope.$watch('iteration.currentTaskIdx', (idx) => {
      let task = scope.iteration.active.tasks[idx];
      if (task) {
        scope.taskUrl = task.url;
      } else {
        scope.taskUrl = null;
      }
    });

    scope.getUrl = () => {
      return this.$window.location.toString();
    };
    this.rankingForwarder(scope, element);
  }

  markAsDone (scope, taskIdx, isDone, noOfTasks) {
    return this.dmRanking.markAsDone(scope.iteration.currentIdx, taskIdx, isDone, noOfTasks);
  }

  getCurrentRanking () {
    return this.dmRanking.getCurrentRankingForUser();
  }

  rankingForwarder (scope, element) {
    var self = this;

    function onWindowMessage (msg) {
      var data;
      try {
        data = JSON.parse(msg.data);
        if (data.isDone === undefined) {
          return;
        }
      } catch (e) {
        return;
      }

      self.markAsDone(scope, data.currentTask, data.isDone, data.noOfTasks).then(sendRanking);
    }

    function sendRanking () {
      self.getCurrentRanking().then((ranking) => {
        var $iframe = element.find('iframe.tasks-iframe');
        ranking.isRanking = true;
        ranking.iterationIdx = scope.iteration.currentIdx;
        $iframe[0].contentWindow.postMessage(JSON.stringify(ranking), scope.taskUrl);
      });
    }

    scope.$watch('taskUrl', () => {
      // Timeout because dm-iframe
      this.$timeout(sendRanking, 1500);
    });

    this.$window.addEventListener('message', onWindowMessage);
    scope.$on('$destroy', () => {
      this.$window.removeEventListener('message', onWindowMessage);
    });
  }

}

xplatformApp.directive('dmEventMenu', ($window, $timeout, dmRanking) => {

  let eventMenu = new EventMenu({
  $window, $timeout, dmRanking});

  return {
    restrict: 'E',
    replace: true,
    scope: {
      event: '=',
      activeIteration: '='
    },
    template: viewTemplate,
    link: eventMenu.link.bind(eventMenu)
  };

});
