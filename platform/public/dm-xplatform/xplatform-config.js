require(['angular',
    'angular-ui-router',
    'slider/bootstrap',
    'xplatform/xplatform-app',
    'xplatform/navbar/xplatform-navbar',
    'xplatform/index/xplatform-index',
    'xplatform/devhero/xplatform-devhero',
    'xplatform/player/xplatform-player',
    'directives/plugins-loader',
    'xplatform/controllers/dm-xplatform-player/dm-xplatform-player'
], function(angular, angularRouter, bootstrap, xplatformApp) {
    xplatformApp.config(['$stateProvider', '$urlRouterProvider',
        function($stateProvider, $urlRouterProvider) {
            $stateProvider.state('navbar', {
                views: {
                    navbar: {
                        templateUrl: '/static/dm-xplatform/navbar/xplatform-navbar.html',
                        controller: 'XplatformNavbarCtrl'
                    }
                }
            });

            $stateProvider.state('navbar.index', {
                url: '/index',
                views: {
                    content: {
                        templateUrl: '/static/dm-xplatform/index/xplatform-index.html',
                        controller: 'XplatformIndexCtrl'
                    }
                }
            });


            $stateProvider.state('navbar.devhero', {
                url: '/devhero',
                views: {
                    content: {
                        templateUrl: '/static/dm-xplatform/devhero/xplatform-devhero.html',
                        controller: 'XplatformDevheroCtrl'
                    }
                }
            });

            $stateProvider.state('player', {
                url: '/player/:id',
                views: {
                    navbar: {
                        //templateUrl: '/static/dm-xplatform/player/xplatform-player.html',
                        templateUrl: '/static/dm-xplatform/controllers/dm-xplatform-player/dm-xplatform-player.html',
                        controller: 'dmXplatformPlayer'
                    }
                }
            });

            $urlRouterProvider.when('/player/', '/player/53b2cd856703ba00002096e9');
            $urlRouterProvider.otherwise('/player/53b2cd856703ba00002096e9');
        }
    ]);
    bootstrap('xplatform');
});
