/* jshint esnext:true,-W097 */

'use strict';

import * as xplatformApp from 'xplatform/xplatform-app';
import _ from '_';
import 'es6!xplatform/directives/dm-event-task-details/dm-event-task-details';

class EventAgenda {

  constructor(data) {
    _.extend(this, data);
  }

  link(scope) {

    var $state = this.$state;
    scope.$watch(()=>{
      return $state.$current;
    }, (state)=>{

      if (state.name !== 'index.space.learn.workspace') {
        scope.activeTask = null;
        return;
      }
      let iterationIdx = this.$stateParams.iteration;
      let taskIdx = this.$stateParams.todo;

      scope.activeTask = scope.event.iterations[iterationIdx].tasks[taskIdx];
    });

  }

}


xplatformApp.directive('dmEventAgenda', ($state, $stateParams) => {

  return {
    restrict: 'E',
    replace: true,
    scope: {
      event: '=',
      userWorkspaceId: '='
    },
    templateUrl: '/static/dm-xplatform/directives/dm-event-agenda/dm-event-agenda.html',
    link(scope, element) {
      let eventMenu = new EventAgenda({
        $stateParams, $state
      });
      eventMenu.link(scope, element);
    }
  };

});
