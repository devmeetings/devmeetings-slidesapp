define(['angular'], function(angular) {
    'use strict'
    angular.module('dm-gravatar', []).filter('dmGravatar', [
        function() {
            return function(input, size) {
                if (!input) {
                  return '';
                }
                input = input.replace('http:', 'https:');
                return input + '?s=' + size + '&d=monsterid';
            };
        }
    ]);

});
