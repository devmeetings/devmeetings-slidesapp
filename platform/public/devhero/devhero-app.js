require(['config'], function () {
    require(['angular', 'angular-ui-router', 'angular-gravatar', 'slider/slider'], function (angular, angularRouter, angularGravatar, slider) {
        angular.module('devhero', ['slider', 'ui.gravatar', 'ui.router']);
        
        angular.module('devhero').config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
            $stateProvider.state('index', {
                url: '/index',
                views: {
                    navbar: {
                        templateUrl: '/static/partials/navbar/navbar.html'
                    },
                    content: {
                        templateUrl: '/static/partials/profile/profile.html'
                    }
                }
            });
            $urlRouterProvider.otherwise('/index');
        }]);
        
    });
});

