require(['angular',
    'angular-ui-router',
    'slider/bootstrap',
    'xplatform/xplatform-app',
    'xplatform/navbar/xplatform-navbar',
    'xplatform/index/xplatform-index',
    'xplatform/devhero/xplatform-devhero',
    'xplatform/player/xplatform-player',
    'directives/plugins-loader',
    'xplatform/controllers/dm-xplatform-player/dm-xplatform-player',
    'xplatform/controllers/dm-xplatform-chapter/dm-xplatform-chapter'
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

            $stateProvider.state('navbar.player', {
                url: '/player/:id',
                views: {
                    content: {
                        //templateUrl: '/static/dm-xplatform/player/xplatform-player.html',
                        templateUrl: '/static/dm-xplatform/controllers/dm-xplatform-player/dm-xplatform-player.html',
                        controller: 'dmXplatformPlayer'
                    }
                }
            });

            $stateProvider.state('navbar.player.chapter', {
                url: '/:index',
                views: {
                    chapter: {
                        templateUrl: '/static/dm-xplatform/controllers/dm-xplatform-chapter/dm-xplatform-chapter.html',
                        controller: 'dmXplatformChapter'
                    }
                }
            });

            $urlRouterProvider.when('/player/', '/player/53ce34758fb745d156d54301/0');
            $urlRouterProvider.otherwise('/player/53ce34758fb745d156d54301/0');
        }
    ]);
    bootstrap('xplatform');
});
