define(['angular',
    'angular-ui-router',
    'angular-gravatar',
    'angular-moment',
    'angular-hotkeys',
    'angular-bootstrap',
    'angular-marked',
    'angular-charts',
    'angular-animate',
    'angular-ui-router',
    'slider/slider.plugins'
], function(angular) {

    return angular.module('dm-courses', [
        'slider.plugins', 'ui.gravatar', 'ui.router', 'ui.bootstrap',
        'angularMoment', 'cfp.hotkeys', 'hc.marked', 'angularCharts',
        'ngAnimate'
    ]);
});