require(['config'], function () {
    require(['angular', 'angular-ui-router', 'angular-deckgrid', 'angular-gravatar', 'slider/slider'], function (angular, angularRouter, angularDeckgrid, angularGravatar, slider) {
        angular.module('xplatform', ['akoenig.deckgrid', 'slider', 'ui.gravatar', 'ui.router']);
        
        angular.module('xplatform').config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
            $stateProvider.state('index', {
                url: '/index',
                views: {
                    navbar: {
                        templateUrl: '/static/partials/navbar/navbar.html'
                    },
                    content: {
                        templateUrl: '/static/partials/deckgrid/deckgrid.html'
                    }
                }
            });
            $urlRouterProvider.otherwise('/index');
        }]);
        
    });
});

