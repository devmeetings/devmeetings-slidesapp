define(['$', 'angular', 'lib/chardin'], function($, angular) {
  'use strict';

  angular.module('dm-intro', []).factory('dmIntro', function($timeout, $window) {

    function getData() {
      var data = $window.localStorage.getItem('introdata') || '{}';
      try {
        return JSON.parse(data);
      } catch (e) {
        return {};
      }
    }

    function saveData(data) {
      $window.localStorage.setItem('introdata', JSON.stringify(data));
    }

    function isFirstTime(key) {
      return !getData()[key];
    }

    function setNotFirstTime(key) {
      var data = getData();
      data[key] = true;
      saveData(data);
    }

    return {
      startIfFirstTime: function(key, $element) {
        if (!isFirstTime(key)) {
          return;
        }

        setNotFirstTime(key);
        $element = $element || 'body';

        $timeout(function() {
          $($element).chardinJs('start');
        }, 1500);
      }
    };

  });

});
