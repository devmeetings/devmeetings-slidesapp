'use strict'
angular.module('dm-gravatar', []).filter('dmGravatar', [function () {
    return function (input, size) {
        input = input.replace('http:', 'https:');
        return input ? input + '?s=' + size + '&d=monsterid' : '';
    };
}]);
