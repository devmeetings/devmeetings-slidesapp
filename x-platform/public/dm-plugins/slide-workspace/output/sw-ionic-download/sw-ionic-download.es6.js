/* jshint esnext:true,-W097 */
'use strict';

import sliderPlugins from 'slider/slider.plugins';
import * as _ from '_';




class IonicDownload {

  constructor(data) {
    _.extend(this, data);
  }

  controller(self) {
    let getAppDownloadAddress = () => {
      let workspaceAddress = this.swLivereloadAddress.getFullAddress(self.workspaceId, self.currentPath);
      let hostAddress = this.swLivereloadAddress.getHostAddress();

      return hostAddress + '/api/ionic/app?path=' + this.$window.encodeURIComponent(workspaceAddress);
    };

    self.openDownloadModal = () => {
      let address = getAppDownloadAddress();

      this.$modal.open({
        templateUrl: '/static/dm-plugins/slide-workspace/output/sw-ionic-download/ionic-qrcode.html',
        controller: function IonicDownloadCtrl($scope, address) {
          $scope.address = address;
        },
        size: 'md',
        resolve: {
          address: () => address
        }
      });
    };
  }

}

sliderPlugins.directive('swIonicDownload', ($window, $modal, swLivereloadAddress) => {
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
        $scope, $window, $modal, swLivereloadAddress
      });
      sw.controller(this);
    }
  };
});
