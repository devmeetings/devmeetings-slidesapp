/* jshint esnext:true,-W097 */

'use strict';

import * as xplatformApp from 'xplatform/xplatform-app';
import * as _ from '_';
import 'es6!../dm-event-agenda/dm-event-agenda';
import 'es6!../dm-event-users/dm-event-users';

class MenuDir {

  constructor(data) {
    _.extend(this, data);
  }

  link(scope) {
  
    scope.stateIncludes = (name) => this.$state.includes(name);

  }

}


xplatformApp.directive('dmXplatformMenu', ($window, $state, $stateParams) => {


  return {
    restrict: 'E',
    replace: true,
    scope: {
      event: '=',
      user: '=',
      userWorkspaceId: '=',
      opened: '=',
      isEditMode: '=?'
    },
    templateUrl: '/static/dm-xplatform/directives/dm-xplatform-menu/dm-xplatform-menu.html',
    link: (scope) => {
      let contextMenu = new MenuDir({
        $window, $state, $stateParams
      });
      contextMenu.link(scope);
    }
  };

});
