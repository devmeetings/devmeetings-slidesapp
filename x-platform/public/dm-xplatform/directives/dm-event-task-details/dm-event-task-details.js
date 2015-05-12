/* jshint esnext:true,-W097 */

'use strict';

import * as xplatformApp from 'xplatform/xplatform-app';
import _ from '_';

class EventTaskDetails {

  constructor(data) {
    _.extend(this, data);
  }

  link(scope, element) {

    scope.getUrl = () => {
      return this.$window.location.toString();
    };
    this.rankingForwarder(scope, element);
  }

  markAsDone(scope, taskIdx, isDone, noOfTasks) {
    return this.dmRanking.markAsDone(scope.currentIterationIdx, taskIdx, isDone, noOfTasks);
  }

  getCurrentRanking() {
    return this.dmRanking.getCurrentRankingForUser();
  }

  rankingForwarder(scope, element) {
    var self = this;

    function onWindowMessage(msg) {
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

    function sendRanking() {
      self.getCurrentRanking().then((ranking) => {
        var $iframe = element.find('iframe.tasks-iframe');
        ranking.isRanking = true;
        ranking.iterationIdx = scope.currentIterationIdx;
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


xplatformApp.directive('dmEventTaskDetails', ($window, $timeout, dmRanking) => {

  return {
    restrict: 'E',
    replace: true,
    scope: {
      currentIterationIdx: '=',
      taskUrl: '='
    },
    templateUrl: '/static/dm-xplatform/directives/dm-event-task-details/dm-event-task-details.html',
    link(scope, element) {
      let eventMenu = new EventTaskDetails({
        $window, $timeout, dmRanking
      });
      eventMenu.link(scope, element);
    }
  };

});
