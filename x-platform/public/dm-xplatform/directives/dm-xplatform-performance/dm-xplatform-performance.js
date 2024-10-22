/* globals define */
define(['angular', 'dm-xplatform/xplatform-app', './dm-xplatform-performance.html!text'], function (angular, xplatformApp, viewTemplate) {
  'use strict';

  var VERSION = 2;

  function readPerformanceData (localStorage) {
    var perf = localStorage['performance' + VERSION];
    try {
      return JSON.parse(perf);
    } catch (e) {
      return {};
    }
  }

  function savePerformanceData (localStorage, perf) {
    localStorage['performance' + VERSION] = JSON.stringify(perf);
  }

  function setPropEnabled (perf, name, enabled) {
    if (enabled) {
      perf.push(name);
    } else if (perf.indexOf(name) > -1) {
      perf.splice(perf.indexOf(name), 1);
    }
  }

  var props = ['anims', 'shadows', 'player_full_screen', 'workspace_output_anim', 'workspace_output_noauto', 'workspace_output_scalling'];

  xplatformApp.run(function ($window, $rootScope, $timeout) {
    $timeout(function () {
      $rootScope.performance = [];
      // Initial Loading of perforamnce data
      var performance = readPerformanceData($window.localStorage);
      props.map(function (prop) {
        setPropEnabled($rootScope.performance, prop, performance[prop]);
      });
    }, 100);
  });

  xplatformApp.directive('dmXplatformPerformance', ['$window', '$rootScope', function ($window, $rootScope) {
    return {
      restrict: 'E',
      scope: {},
      template: viewTemplate,
      link: function (scope) {
        scope.performance = readPerformanceData($window.localStorage);

        function prop (name) {
          scope.$watch('performance.' + name, function (enabled) {
            setPropEnabled($rootScope.performance, name, enabled);
            savePerformanceData($window.localStorage, scope.performance);
          });
        }

        props.map(prop);
      }
    };
  }]);
});
