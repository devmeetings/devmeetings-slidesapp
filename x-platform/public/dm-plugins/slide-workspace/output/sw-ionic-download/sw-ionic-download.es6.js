/* jshint esnext:true,-W097 */
'use strict';

import sliderPlugins from 'slider/slider.plugins';
import * as _ from '_';

class IonicDownload {

  constructor(data) {
    _.extend(this, data);
  }

  controller(self) {
    self.getAppDownloadAddress = () => {
      let workspaceAddress = this.swLivereloadAddress.getFullAddress(self.workspaceId, self.currentPath);

      return '/api/ionic/app?path=' + this.$window.encodeURIComponent(workspaceAddress);
    };
  }

}

sliderPlugins.directive('swIonicDownload', ($window, swLivereloadAddress) => {
  return {
    restrict: 'E',
    scope: {
      workspaceId: '=',
      currentPath: '='
    },
    bindToController: true,
    controllerAs: 'model',
    templateUrl: '/static/dm-plugins/slide-workspace/output/sw-ionic-download/sw-ionic-download.html',
    controller($scope) {
      let sw = new IonicDownload({
        $scope, $window, swLivereloadAddress
      });
      sw.controller(this);
    }
  };
});
