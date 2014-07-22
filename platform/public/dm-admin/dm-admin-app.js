define(['angular',
        'angular-ui-router',
        'angular-ui-sortable',
        'restangular',
        'dm-video',
        'slider/slider',
        'slider/slider.plugins'
], function (angular, angularRouter) {
    return angular.module('dm-admin', ['ui.router', 'ui.sortable', 'restangular', 'dm-video', 'slider', 'slider.plugins']);
});
