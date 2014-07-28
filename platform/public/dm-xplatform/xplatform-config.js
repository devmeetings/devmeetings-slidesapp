require(['angular',
    'angular-ui-router',
    'slider/bootstrap',
    'xplatform/xplatform-app',
    'xplatform/controllers/dm-xplatform-navbar/xplatform-navbar',
    'xplatform/controllers/dm-xplatform-index/xplatform-index',
    'directives/plugins-loader',
    'xplatform/controllers/dm-xplatform-player/dm-xplatform-player',
    'xplatform/controllers/dm-xplatform-chapter/dm-xplatform-chapter',
    'xplatform/controllers/dm-xplatform-devhero/dm-xplatform-devhero',
    'xplatform/controllers/dm-xplatform-live/dm-xplatform-live',
    'xplatform/controllers/dm-xplatform-online/dm-xplatform-online',
    'xplatform/controllers/dm-xplatform-video/dm-xplatform-video'
], function(angular, angularRouter, bootstrap, xplatformApp) {
    xplatformApp.config(['$stateProvider', '$urlRouterProvider',
        function($stateProvider, $urlRouterProvider) {
            $stateProvider.state('navbar', {
                views: {
                    navbar: {
                        templateUrl: '/static/dm-xplatform/controllers/dm-xplatform-navbar/xplatform-navbar.html',
                        controller: 'XplatformNavbarCtrl'
                    }
                }
            });

            $stateProvider.state('navbar.index', {
                url: '/index',
                views: {
                    content: {
                        templateUrl: '/static/dm-xplatform/controllers/dm-xplatform-index/xplatform-index.html',
                        controller: 'XplatformIndexCtrl'
                    }
                }
            });
            
            $stateProvider.state('navbar.index.live', {
                url: '/live',
                views: {
                    list: {
                        templateUrl: '/static/dm-xplatform/controllers/dm-xplatform-live/dm-xplatform-live.html',
                        controller: 'dmXplatformLive'
                    }
                }
            });

            $stateProvider.state('navbar.index.online', {
                url: '/online',
                views: {
                    list: {
                        templateUrl: '/static/dm-xplatform/controllers/dm-xplatform-online/dm-xplatform-online.html',
                        controller: 'dmXplatformOnline'
                    }
                }
            });

            $stateProvider.state('navbar.index.video', {
                url: '/video',
                views: {
                    list: {
                        templateUrl: '/static/dm-xplatform/controllers/dm-xplatform-video/dm-xplatform-video.html',
                        controller: 'dmXplatformVideo'
                    }
                }
            });

            $stateProvider.state('navbar.devhero', {
                url: '/devhero/:id',
                views: {
                    content: {
                        templateUrl: '/static/dm-xplatform/controllers/dm-xplatform-devhero/dm-xplatform-devhero.html',
                        controller: 'dmXplatformDevhero'
                    }
                }
            });

            $stateProvider.state('navbar.player', {
                url: '/player/:id',
                views: {
                    content: {
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
            //$urlRouterProvider.otherwise('/player/53ce34758fb745d156d54301/0');
            $urlRouterProvider.when('/index', '/live');
            $urlRouterProvider.otherwise('/index/live');
        }
    ]);
    bootstrap('xplatform');
});
