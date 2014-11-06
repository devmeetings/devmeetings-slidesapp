define(['angular',
    'angular-ui-router',
    'angular-deckgrid',
    'angular-gravatar',
    'angular-slider',
    'angular-moment',
    'angular-hotkeys',
    'angular-bootstrap',
    'angular-marked',
    'angular-charts',
    'angular-animate',
    'slider/slider',
    'slider/slider.plugins',
    'dm-modules/dm-training/dm-training',
    'dm-modules/dm-user/dm-user',
    'dm-modules/dm-observe/dm-observe',
    'dm-modules/dm-stream/dm-stream',
    'dm-modules/dm-mongotime/dm-mongotime',
    'dm-modules/dm-gravatar/dm-gravatar',
    'dm-modules/dm-wavesurfer/dm-wavesurfer'
], function(angular) {

    return angular.module('xplatform', [
        'slider', 'slider.plugins', 'ui.gravatar', 'ui.router', 'ui.bootstrap',
        'akoenig.deckgrid', 'vr.directives.slider', 'angularMoment', 'cfp.hotkeys', 'hc.marked', 'angularCharts',
        'dm-training', 'dm-user', 'dm-observe', 'dm-stream', 'dm-mongotime', 'dm-gravatar', 'dm-wavesurfer', 'ngAnimate'
    ]);
});