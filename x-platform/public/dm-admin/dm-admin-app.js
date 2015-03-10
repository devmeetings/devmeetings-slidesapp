define(['angular',
    'angular-ui-router',
    'angular-ui-sortable',
    'dm-modules/dm-wavesurfer/dm-wavesurfer',
    'dm-admin/slider-admin',
    'slider/slider',
    'slider/slider.plugins'
], function(angular, angularRouter) {
    return angular.module('dm-admin', [
        'ui.router', 'ui.sortable', 'dm-wavesurfer', 
        'slider', 'slider.plugins', 'slider.admin'
    ]);
});
