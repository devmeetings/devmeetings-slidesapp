define(['angular', 'dm-xplatform/xplatform-app'], function(angular, xplatformApp) {
  'use strict';

  function readPerformanceData(localStorage) {
    var perf = localStorage.performance;
    try {
      return JSON.parse(perf);
    } catch (e) {
      return {};
    }
  }

  function savePerformanceData(localStorage, perf) {
    localStorage.performance = JSON.stringify(perf);
  }

  function setPropEnabled(perf, name, enabled) {
    if (enabled) {
      perf.push(name);
    } else if (perf.indexOf(name) > -1) {
      perf.splice(perf.indexOf(name), 1);
    }
  }


  var props = ['anims', 'shadows', 'player_full_screen', 'workspace_output_noanim', 'workspace_output_noauto', 'workspace_output_scalling'];

  xplatformApp.run(function($window, $rootScope, $timeout) {
    $timeout(function() {
      $rootScope.performance = [];
      // Initial Loading of perforamnce data
      var performance = readPerformanceData($window.localStorage);
      props.map(function(prop) {
        setPropEnabled($rootScope.performance, prop, performance[prop]);
      });
    }, 100);
  });

  xplatformApp.directive('dmXplatformPerformance', ['$window', '$rootScope', function($window, $rootScope) {

    return {
      restrict: 'E',
      scope: {},
      templateUrl: '/static/dm-xplatform/directives/dm-xplatform-performance/dm-xplatform-performance.html',
      link: function(scope) {
        scope.performance = readPerformanceData($window.localStorage);

        function prop(name) {
          scope.$watch('performance.' + name, function(enabled) {
            setPropEnabled($rootScope.performance, name, enabled);
            savePerformanceData($window.localStorage, scope.performance);
          });
        }

        props.map(prop);
      }
    };
  }]);
});
