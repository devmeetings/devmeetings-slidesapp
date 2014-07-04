require(['angular',
    'angular-ui-router',
    'slider/bootstrap',
    'xplatform/xplatform-app',
    'xplatform/navbar/xplatform-navbar',
    'xplatform/index/xplatform-index',
    'xplatform/devhero/xplatform-devhero',
    'xplatform/player/xplatform-player',
    'directives/plugins-loader'
], function(angular, angularRouter, bootstrap, xplatformApp) {
    xplatformApp.config(['$stateProvider', '$urlRouterProvider',
        function($stateProvider, $urlRouterProvider) {
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
                        templateUrl: '/static/xplatform/index/xplatform-index.html',
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

            $stateProvider.state('navbar.player', {
                url: '/player/:layout',
                views: {
                    content: {
                        templateUrl: '/static/partials/player/player.html',
                        controller: 'XplatformPlayerCtrl'
                    }
                }
            });

            $urlRouterProvider.when('/player/', '/player/first');
            $urlRouterProvider.otherwise('/index');
        }
    ]);
    bootstrap('xplatform');
});
