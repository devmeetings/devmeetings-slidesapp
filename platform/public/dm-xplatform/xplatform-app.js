define(['angular',
        'angular-ui-router',
        'angular-deckgrid',
        'angular-gravatar',
        'angular-slider',
        'angular-moment',
        'angular-hotkeys',
        'angular-bootstrap',
        'slider/slider',
        'slider/slider.plugins',
        'dm-video',
        'dm-training',
        'dm-user',
        'dm-observe',
        'dm-stream',
        'dm-mongotime',
        'dm-gravatar'
], function (angular, angularRouter, angularDeckgrid, angularGravatar, angularSlider, angularMoment, angularHotkeys, angularBootstrap, slider) {
    return angular.module('xplatform', ['akoenig.deckgrid', 'slider', 'ui.gravatar', 'ui.router', 'slider.plugins', 'vr.directives.slider', 'angularMoment', 'cfp.hotkeys', 'ui.bootstrap', 'dm-video', 'dm-training', 'dm-user', 'dm-observe', 'dm-stream', 'dm-mongotime', 'dm-gravatar']); 
});
