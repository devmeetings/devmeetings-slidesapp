/* jshint esnext:true,-W097 */
'use strict';


import sliderPlugins from 'slider/slider.plugins';

function ModalCtrl($scope, $window, address) {
  var loc = $window.location;
  var fullUrl = loc.protocol + '//' + loc.host + address;
  $scope.address = fullUrl;
}

sliderPlugins.directive('swOutputAddress', ($modal) => {

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

      scope.getWorkspaceAddress = () => {
        return '/api/workspace/page/' + scope.workspaceId + scope.currentPath;
      };

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
