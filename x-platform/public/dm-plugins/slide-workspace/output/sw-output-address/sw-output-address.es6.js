/* jshint esnext:true,-W097 */
'use strict';


import sliderPlugins from 'slider/slider.plugins';

function ModalCtrl($scope, address) {
  $scope.address = address;
}

sliderPlugins.directive('swOutputAddress', ($modal, swLivereloadAddress) => {

  return {
    restrict: 'E',
    replace: true,
    scope: {
      withAddress: '=',
      onRefresh: '&',
      highlightRefresh: '=',
      hideBaseUrl: '=',
      baseUrl: '=',
      currentPath: '=',
      appliedPath: '=',
      workspaceId: '='
    },
    transclude: true,
    bindToController: true,
    controllerAs: 'model',
    templateUrl: '/static/dm-plugins/slide-workspace/output/sw-output-address/sw-output-address.html',
    controller: function() {
      let scope = this;
      scope.urlKeyPress = function(ev) {
        if (ev.keyCode !== 13) {
          return;
        }
        if (scope.appliedPath === scope.currentPath) {
          scope.onRefresh();
          return;
        }
        scope.appliedPath = scope.currentPath;
      };

      scope.getWorkspaceAddress = () => swLivereloadAddress.getAddress(scope.workspaceId, scope.currentPath);
      scope.getFullWorkspaceAddress = () => swLivereloadAddress.getFullAddress(scope.workspaceId, scope.currentPath);

      scope.openQrDialog = (url) => {
        $modal.open({
          templateUrl: '/static/dm-plugins/slide-workspace/output/sw-output-address/qrcode.html',
          controller: ModalCtrl,
          size: 'md',
          resolve: {
            address: () => url
          }
        });
      };
    }
  };

});
