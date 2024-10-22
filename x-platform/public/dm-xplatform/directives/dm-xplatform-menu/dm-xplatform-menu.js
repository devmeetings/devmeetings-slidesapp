/* jshint esnext:true,-W097 */

'use strict';

import xplatformApp from 'dm-xplatform/xplatform-app';
import _ from '_';
import '../dm-event-agenda/dm-event-agenda';
import '../dm-event-users/dm-event-users';
import viewTemplate from './dm-xplatform-menu.html!text';

class MenuDir {

  constructor (data) {
    _.extend(this, data);
  }

  link (scope) {
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
    template: viewTemplate,
    link: (scope) => {
      let contextMenu = new MenuDir({
        $window, $state, $stateParams
      });
      contextMenu.link(scope);
    }
  };
});
