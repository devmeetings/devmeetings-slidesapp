/* jshint esnext:true,-W097 */
'use strict';

import sliderPlugins from 'slider/slider.plugins';
import _ from '_';

class SwOutput {

  constructor(data) {
    _.extend(this, data);
  }

  controller(scope, $scope) {
    let self = this;
    $scope.$watch(() => scope.appliedPath, (newPath, oldPath) => {
      if (newPath === oldPath) {
        return;
      }
      if (self.isAutoOutput()) {
        self.applyCurrentUrl(scope);
      }
    });

    $scope.$watch(() => scope.currentPath, (currentPath) => {
      if (currentPath === undefined) {
        scope.currentPath = '/';
      }
    });

    $scope.$on('refreshUrl', () => {
      self.applyCurrentUrl(scope);
    });

    scope.applyCurrentUrl = () => {
      self.applyCurrentUrl(scope);
    };
  }

  applyCurrentUrl(scope) {
    scope.currentBaseUrl = scope.baseUrl;
    scope.currentAppliedPath = scope.appliedPath;
    this.refreshCurrentUrl(scope);
  }

  isAutoOutput() {
    return this.$rootScope.performance.indexOf('workspace_output_noauto') === -1;
  }

  refreshCurrentUrl(scope) {
    let path = scope.currentAppliedPath || '/';
    let randomPart = this.getRandomPart(path);
    if (!scope.currentBaseUrl) {
      return;
    }
    scope.currentUrl = scope.currentBaseUrl + path + randomPart;
  }

  getRandomPart(path) {
    let part = new Date().getTime();

    if (path.indexOf('?') > -1) {
      return '&' + part;
    }

    return '?' + part;
  }

}

sliderPlugins.directive('swOutput', ($rootScope) => {

  return {
    restrict: 'E',
    replace: true,
    scope: {
      withConsole: '=',
      withConsoleInColumns: '=',
      withAddress: '=',
      withIonic: '=',
      isDead: '=',
      baseUrl: '=',
      hideBaseUrl: '=',
      currentPath: '=',
      appliedPath: '=',
      workspaceId: '=',

      onNotifyEval: '&',
      needsEval: '=',
    },
    bindToController: true,
    controllerAs: 'model',
    templateUrl: '/static/dm-plugins/slide-workspace/output/sw-output/sw-output.html',
    controller($scope) {
      this.output = {};

      let output = new SwOutput({
        $rootScope
      });

      output.controller(this, $scope);
    }
  };

});
