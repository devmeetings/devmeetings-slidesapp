/* globals define */
define(['angular'], function (angular) {
  'use strict';
  angular.module('dm-gravatar', []).filter('dmGravatar', [
    function () {
      return function (input, size) {
        if (!input) {
          input = 'https://www.gravatar.com/avatar/default';
        }
        input = input.replace('http:', 'https:');
        return input + '?s=' + size + '&d=identicon';
      };
    }
  ]);

});
