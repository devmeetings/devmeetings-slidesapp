define(['angular'], function (angular) {
  'use strict';

  angular.module('dm-sref-show', []).directive('dmSrefShow', function ($state) {
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        scope.$watch(function () {
          return $state.includes(attrs.dmSrefShow);
        }, function (includes) {
          element.toggleClass('ng-hide', !includes);
        });
      }
    };
  });

});
