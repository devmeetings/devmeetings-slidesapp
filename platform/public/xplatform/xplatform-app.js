require(['config'], function () {
    require(['angular', 'angular-ui-router', 'angular-deckgrid', 'angular-gravatar', 'slider/slider'], function (angular, angularRouter, angularDeckgrid, angularGravatar, slider) {
        angular.module('xplatform', ['akoenig.deckgrid', 'slider', 'ui.gravatar', 'ui.router']);
        
        angular.module('xplatform').config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
            $stateProvider.state('navbar', {
                views: {
                    navbar: {
                        templateUrl: '/static/partials/navbar/navbar.html',
                        controller: 'XplatformNavbarCtrl'
                    }
                }
            });

            $stateProvider.state('navbar.index', {
                url: '/index',
                views: {
                    content: {
                        templateUrl: '/static/partials/deckgrid/deckgrid.html',
                        controller: 'XplatformIndexCtrl'
                    }
                }
            });

    
            $stateProvider.state('navbar.devhero', {
                url: '/devhero',
                views: {
                    content: {
                        templateUrl: '/static/partials/profile/profile.html'         
                    }
                }
            });

            $urlRouterProvider.otherwise('/index');
        }]);
    });
});

