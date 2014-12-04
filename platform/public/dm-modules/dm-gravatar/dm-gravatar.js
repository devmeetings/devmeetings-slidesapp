define(['angular'], function(angular) {
    'use strict'
    angular.module('dm-gravatar', []).filter('dmGravatar', [
        function() {
            return function(input, size) {
                if (!input) {
                  return 'https://www.gravatar.com/avatar/ee4d1b570eff6ce63c7d97043980a98c?default=monsterid&forcedefault=1';
                }
                input = input.replace('http:', 'https:');
                return input ? input + '?s=' + size + '&d=monsterid' : '';
            };
        }
    ]);

});
