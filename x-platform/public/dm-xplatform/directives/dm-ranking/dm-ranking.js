/* jshint esnext:true,-W097 */

'use strict';

import * as xplatformApp from 'xplatform/xplatform-app';
import * as _ from '_';

class RankingDir {

  constructor(data) {
    _.extend(this, data);
  }

  link(scope) {
    this.dmRanking.getCurrentRanking(); 
    scope.ranking = this.dmRanking;
  }

}


xplatformApp.directive('dmRanking', (dmRanking) => {


  return {
    restrict: 'E',
    replace: true,
    scope: {

    },
    templateUrl: '/static/dm-xplatform/directives/dm-ranking/dm-ranking.html',
    link: (scope) => {
      let contextMenu = new RankingDir({
        dmRanking
      });
      contextMenu.link(scope);
    }
  };

});
