/* jshint esnext:true,-W097 */
'use strict';


import sliderPlugins from 'slide/slider.plugins';
import * as module from 'module';
import * as _ from '_';


class SwOutput {

  constructor(data) {
    _.extend(this, data);
  }

  link(scope) {

    scope.$watch('baseUrl', (newBaseUrl, oldBaseUrl) => {
      this.updateBaseUrl(scope, newBaseUrl, oldBaseUrl);
    });

    scope.$watch('appliedPath', (newAppliedPath) => {
      this.updateAppliedPath(scope, newAppliedPath);
    });

    scope.refreshCurrentUrl = () => {
      this.refreshCurrentUrl(scope);
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

  refreshCurrentUrl(scope) {
    let randomPart = this.getRandomPart(scope.currentAppliedPath);
    scope.currentUrl = scope.currentBaseUrl + scope.currentAppliedPath + randomPart;
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
    templateUrl: path + '/sw-output.html',
    link: function(scope) {
      scope.output = {};

      let output = new SwOutput({
        $rootScope
      });

      output.link(scope);
    }
  };

});
