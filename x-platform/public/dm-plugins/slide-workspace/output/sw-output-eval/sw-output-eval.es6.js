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
    
    sliderPlugins.listen(scope, 'slide.slide-workspace.change', () => {
      this.dmPlayer.getCurrentStateId().then((id) => {
        scope.baseUrl = '/api/page/' + id;
        scope.codeId = id;
      });
    });
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
      isWithConsole: '='
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
