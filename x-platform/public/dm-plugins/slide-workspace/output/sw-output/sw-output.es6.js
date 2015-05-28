/* jshint esnext:true,-W097 */
'use strict';


import sliderPlugins from 'slider/slider.plugins';
import * as module from 'module';
import * as _ from '_';

class SwOutput {

  constructor(data) {
    _.extend(this, data);
  }

  controller(scope, $scope) {

    $scope.$watch(() => scope.baseUrl, (newBaseUrl, oldBaseUrl) => {
      this.updateBaseUrl(scope, newBaseUrl, oldBaseUrl);
    });

    $scope.$watch(() => scope.currentPath, (currentPath)=>{
      if (currentPath === undefined) {
        scope.currentPath = '/';
      }
    });

    $scope.$watch(() => scope.appliedPath, (newAppliedPath) => {
      this.updateAppliedPath(scope, newAppliedPath);
    });

    scope.applyCurrentUrl = () => {
      this.applyCurrentUrl(scope);
    };
  }

  updateBaseUrl(scope, newBaseUrl) {
    if (!this.isAutoOutput()) {
      return;
    }
    scope.currentBaseUrl = newBaseUrl;
    this.refreshCurrentUrl(scope);
  }

  updateAppliedPath(scope, newAppliedPath) {
    if (!this.isAutoOutput()) {
      return;
    }
    scope.currentAppliedPath = newAppliedPath;
    this.refreshCurrentUrl(scope);
  }

  applyCurrentUrl(scope) {
    scope.currentBaseUrl = scope.baseUrl;
    scope.currentAppliedPath = scope.appliedPath;
    this.refreshCurrentUrl(scope);
  }

  refreshCurrentUrl(scope) {
    let path = scope.currentAppliedPath || '/';
    let randomPart = this.getRandomPart(path);
    scope.currentUrl = scope.currentBaseUrl + path + randomPart;
  }

  getRandomPart(path) {
    let part = new Date().getTime();

    if (path.indexOf('?') > -1) {
      return '&' + part;
    }

    return '?' + part;
  }

  isAutoOutput() {
    return this.$rootScope.performance.indexOf('workspace_output_noauto') === -1;
  }
}

var path = sliderPlugins.extractPath(module);

sliderPlugins.directive('swOutput', ($rootScope) => {

  return {
    restrict: 'E',
    replace: true,
    scope: {
      withConsole: '=',
      withConsoleInColumns: '=',
      withAddress: '=',
      isDead: '=',
      baseUrl: '=',
      hideBaseUrl: '=',
      currentPath: '=',
      appliedPath: '='
    },
    bindToController: true,
    controllerAs: 'model',
    templateUrl: path + '/sw-output.html',
    controller($scope) {
      this.output = {};

      let output = new SwOutput({
        $rootScope
      });

      output.controller(this, $scope);
    }
  };

});
