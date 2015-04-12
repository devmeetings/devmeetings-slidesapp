define(['angular', 'xplatform/xplatform-app'], function (angular, xplatformApp) {
  'use strict';

  function readPerformanceData(localStorage) {
    var perf = localStorage.performance;
    try {
      return JSON.parse(perf);
    } catch(e) {
      return {};
    }
  }
  function savePerformanceData(localStorage, perf) {
    localStorage.performance = JSON.stringify(perf);
  }

  xplatformApp.directive('dmXplatformPerformance', ['$window', '$rootScope', function($window, $rootScope) {
    return {
      restrict: 'E',
      scope:{},
      templateUrl: '/static/dm-xplatform/directives/dm-xplatform-performance/dm-xplatform-performance.html',
      link: function (scope) {
        scope.performance = readPerformanceData($window.localStorage);
        $rootScope.performance = [];

        prop('anims');
        prop('shadows');
        prop('player_full_screen');
        prop('workspace_output_noanim');
        prop('workspace_output_noauto');
        prop('workspace_output_scalling');

        function prop(name) {
          scope.$watch('performance.' + name, function(enabled) {
            var perf = $rootScope.performance;
            if (enabled) {
              perf.push(name);
            } else if (perf.indexOf(name) > -1) {
              perf.splice(perf.indexOf(name), 1);
            }
            savePerformanceData($window.localStorage, scope.performance);
          });
        }
      }
    };
  }]);
});

