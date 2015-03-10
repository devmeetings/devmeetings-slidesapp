define(['angular',
    'angular-ui-router',
    'angular-ui-sortable',
    'dm-modules/dm-training/dm-training',
    'dm-modules/dm-wavesurfer/dm-wavesurfer',
    'slider/slider',
    'slider/slider.plugins'
], function(angular, angularRouter) {
    return angular.module('dm-admin', ['ui.router', 'ui.sortable', 'dm-training', 'dm-wavesurfer', 'slider', 'slider.plugins']);
});
