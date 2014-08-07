'use strict'
angular.module('dm-gravatar', []).filter('dmGravatar', [function () {
    return function (input, size) {
        return input + '?s=' + size;
    };
}]);
