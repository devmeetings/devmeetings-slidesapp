define(['angular',
    'angular-ui-router',
    'angular-deckgrid',
    'angular-gravatar',
    'angular-slider',
    'angular-moment',
    'angular-hotkeys',
    'angular-bootstrap',
    'angular-marked',
    'slider/slider',
    'slider/slider.plugins',
    'dm-video',
    'dm-training',
    'dm-user',
    'dm-observe',
    'dm-stream',
    'dm-mongotime',
    'dm-gravatar',
    'dm-wavesurfer'
], function(angular, angularRouter, angularDeckgrid, angularGravatar, angularSlider, angularMoment, angularHotkeys, angularBootstrap, slider) {
    return angular.module('xplatform', ['akoenig.deckgrid', 'slider', 'ui.gravatar', 'ui.router', 'slider.plugins', 'vr.directives.slider', 'angularMoment', 'cfp.hotkeys', 'hc.marked', 'ui.bootstrap', 'dm-video', 'dm-training', 'dm-user', 'dm-observe', 'dm-stream', 'dm-mongotime', 'dm-gravatar', 'dm-wavesurfer']);
});