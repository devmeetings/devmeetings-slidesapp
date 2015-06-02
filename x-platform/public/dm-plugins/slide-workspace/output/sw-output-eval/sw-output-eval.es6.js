/* jshint esnext:true,-W097 */
'use strict';


import sliderPlugins from 'slider/slider.plugins';
import * as _ from '_';



class SwOutputEval {

  constructor(data) {
    _.extend(this, data);
  }

  link(scope) {
    // TODO [ServerEvents]

    this.dmPlayer.onSyncStarted(scope, (patches) => {
      // TODO [ToDr] Determine if we need to refresh the workspace?
      scope.isSyncing = true;
    });

    scope.isSyncing = true;
    this.dmPlayer.onCurrentStateId(scope, (id) => {
      if (!scope.isSyncing) {
        return;
      }

      scope.isSyncing = false;
      this.updateCodeId(scope, id);
    });
  }


  updateCodeId(scope, id) {
    scope.baseUrl = '/api/page/' + id;
    scope.codeId = id;
  }

}

sliderPlugins.directive('swOutputEval', (dmPlayer) => {

  return {
    restrict: 'E',
    replace: true,
    scope: {
      baseUrl: '=',
      codeId: '=',
      hideBaseUrl: '=',
      isDead: '=',
      isWithConsole: '=',
      isSyncing: '='
    },
    link: function(scope) {
      scope.hideBaseUrl = true;
      scope.isDead = false;
      scope.isWithConsole = false;

      let eva = new SwOutputEval({
        dmPlayer
      });
      eva.link(scope);
    }
  };

});
