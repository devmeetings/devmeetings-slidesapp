define(['angular',
        'angular-ui-router',
        'angular-deckgrid',
        'angular-gravatar',
        'slider/slider',
        'slider/slider.plugins'
], function (angular, angularRouter, angularDeckgrid, angularGravatar, slider) {
    return angular.module('xplatform', ['akoenig.deckgrid', 'slider', 'ui.gravatar', 'ui.router', 'slider.plugins']); 
});
