define(['angular',
        'angular-ui-router',
        'angular-ui-sortable',
        'restangular'
], function (angular, angularRouter) {
    return angular.module('dm-admin', ['ui.router', 'ui.sortable', 'restangular']);
});
