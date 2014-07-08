define(['angular',
        'angular-ui-router',
        'angular-deckgrid',
        'angular-gravatar',
        'angular-slider',
        'angular-moment',
        'slider/slider',
        'slider/slider.plugins'
], function (angular, angularRouter, angularDeckgrid, angularGravatar, angularSlider, angularMoment, slider) {
    return angular.module('xplatform', ['akoenig.deckgrid', 'slider', 'ui.gravatar', 'ui.router', 'slider.plugins', 'vr.directives.slider', 'angularMoment']); 
});
