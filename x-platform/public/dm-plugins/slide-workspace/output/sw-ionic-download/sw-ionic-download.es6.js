/* jshint esnext:true,-W097 */
'use strict';

import sliderPlugins from 'slider/slider.plugins';
import _ from '_';
import viewTemplate from './sw-ionic-download.html!text';
import qrCodeTemplate from './ionic-qrcode.html!text';

class IonicDownload {

  constructor (data) {
    _.extend(this, data);
  }

  controller (self) {
    let getAppDownloadAddress = () => {
      let workspaceAddress = this.swLivereloadAddress.getFullAddress(self.workspaceId, self.currentPath);
      let hostAddress = this.swLivereloadAddress.getHostAddress();

      return hostAddress + '/api/ionic/app?path=' + this.$window.encodeURIComponent(workspaceAddress);
    };

    self.openDownloadModal = () => {
      let address = getAppDownloadAddress();

      this.$modal.open({
        template: qrCodeTemplate,
        controller: function IonicDownloadCtrl ($scope, address) {
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
    template: viewTemplate,
    controller ($scope) {
      let sw = new IonicDownload({
      $scope, $window, $modal, swLivereloadAddress});
      sw.controller(this);
    }
  };
});
