'use strict'
angular.module('dm-mongotime', []).filter('dmMongotime', [function () {
    return function (input) {
        return new Date(parseInt(input.toString().slice(0,8), 16)*1000);
    };
}]);
