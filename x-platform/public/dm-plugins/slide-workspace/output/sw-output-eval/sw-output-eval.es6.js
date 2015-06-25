/* jshint esnext:true,-W097 */
'use strict';


import sliderPlugins from 'slider/slider.plugins';
import _ from '_';


class ShouldRefreshLogic {


  shouldRefresh(patches) {
    return _.any(patches, this.shouldRefreshSingle, this);
  }

  shouldRefreshSingle(patch) {
    if (patch.current) {
      return true;
    }

    var workspace = patch.patch.workspace;
    if (!workspace) {
      return false;
    }

    var tabs = workspace.tabs;
    if (!tabs) {
      return false;
    }

    return _.any(
      Object.keys(tabs).map((tabName) => {
        if (tabs[tabName].content) {
          return true;
        }
        return false;
      })
    );
  }
}




class SwOutputEvalFrontend {

  constructor(data) {
    _.extend(this, data);
  }

  controller(scope) {
    this.dmPlayer.onSyncStarted(scope, (patches) => {
      if (!this.refreshLogic.shouldRefresh(patches)) {
        return;
      }
      scope.isSyncing = true;
    });

    scope.isSyncing = true;
    this.dmPlayer.onCurrentStateId(scope, (id) => {
      // TODO [ToDr] I know it's shitty.
      this.dmPlayer.shouldRefreshPage = scope.isSyncing;
      if (!scope.isSyncing) {
        return;
      }

      scope.isSyncing = false;
      scope.codeId = id;
      scope.baseUrl = '/api/page/' + scope.codeId;
    });

    scope.$on('evalOutput', () => {
      scope.onRefresh();
    });

  }
}

class SwOutputEvalServer {

  constructor(data) {
    _.extend(this, data);
  }

  controller(scope) {
    this.dmPlayer.onSyncStarted(scope, (patches) => {
      if (!this.refreshLogic.shouldRefresh(patches)) {
        return;
      }
      scope.isSyncing = true;
    });

    scope.isSyncing = true;
    this.dmPlayer.onCurrentStateId(scope, (id) => {
      if (!scope.isSyncing) {
        return;
      }

      scope.isSyncing = false;
      scope.codeId = id;
    });

    scope.$on('evalOutput', () => {
      scope.isWaitingForEval = true;
      sliderPlugins.trigger('slide.slide-workspace.run', scope.workspace, scope.path);
    });

    sliderPlugins.listen(scope, 'slide.serverRunner.result', (result) => {
      var port = result.port;
      var host = result.url || this.$location.host();
      var wasDead = scope.isDead;

      scope.$apply(() => {
        scope.isDead = result.isDead;
        scope.baseUrl = 'http://' + host + ':' + port;

        // Defer onRefresh to let baseUrl to propagate
        this.$timeout(() => {
          // Refresh the page only if waiting for the page
          if (scope.isWaitingForEval || wasDead !== scope.isDead) {
            scope.onRefresh();
            scope.isWaitingForEval = false;
          }
        });
      });
    });
  }
}

sliderPlugins.directive('swOutputEval', (dmPlayer, $location, $timeout) => {

  return {
    restrict: 'E',
    replace: true,
    scope: {
      workspace: '=',
      path: '=',
      serverRunner: '=',
      onRefresh: '&',

      baseUrl: '=',
      codeId: '=',
      hideBaseUrl: '=',

      isDead: '=',
      isWithConsole: '=',
      isSyncing: '='
    },
    controller: function($scope) {

      let refreshLogic = new ShouldRefreshLogic();

      if ($scope.serverRunner) {
        $scope.hideBaseUrl = false;
        $scope.isDead = true;
        $scope.isWithConsole = true;

        let eva = new SwOutputEvalServer({
          dmPlayer, refreshLogic, $location, $timeout
        });
        eva.controller($scope);

      } else {
        $scope.hideBaseUrl = true;
        $scope.isDead = false;
        $scope.isWithConsole = false;

        let eva = new SwOutputEvalFrontend({
          dmPlayer, refreshLogic
        });
        eva.controller($scope);
      }
    }
  };

});
