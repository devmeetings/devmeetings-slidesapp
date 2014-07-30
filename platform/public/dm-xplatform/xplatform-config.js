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
    'xplatform/controllers/dm-xplatform-leftbar/dm-xplatform-leftbar',
    'xplatform/controllers/dm-xplatform-table/dm-xplatform-table',
    'xplatform/controllers/dm-xplatform-observed/dm-xplatform-observed',
    'xplatform/controllers/dm-xplatform-message/dm-xplatform-message',
    'xplatform/controllers/dm-xplatform-stream/dm-xplatform-stream'
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
                },
                onEnter: function ($rootScope) {
                    $rootScope.xplatformData = {
                        columns: {}
                    };
                }
            });
           
            $stateProvider.state('navbar.index.menu', {
                url: '/:type',
                views: {
                    left: {
                        templateUrl: '/static/dm-xplatform/controllers/dm-xplatform-leftbar/dm-xplatform-leftbar.html',
                        controller: 'dmXplatformLeftbar'
                    },
                    mid: {
                        templateUrl: '/static/dm-xplatform/controllers/dm-xplatform-table/dm-xplatform-table.html',
                        controller: 'dmXplatformTable'
                    }
                },
                onEnter: function ($rootScope) {
                    $rootScope.xplatformData.columns = {
                        left: 2,
                        mid: 10,
                        right: 0
                    };
                }
            });
            
            $stateProvider.state('navbar.index.devhero', {
                url: '/devhero/:id',
                views: {
                    left: {
                        templateUrl: '/static/dm-xplatform/controllers/dm-xplatform-devhero/dm-xplatform-devhero.html',
                        controller: 'dmXplatformDevhero'
                    },
                    right: {
                        templateUrl: '/static/dm-xplatform/controllers/dm-xplatform-observed/dm-xplatform-observed.html',
                        controller: 'dmXplatformObserved'
                    }
                },
                onEnter: function ($rootScope) {
                    $rootScope.xplatformData.columns = {
                        left: 4,
                        mid: 4,
                        right: 4
                    };
                }
            });

            $stateProvider.state('navbar.index.message', {
                url: '/message/:id',
                views: {
                    left: {
                        templateUrl: '/static/dm-xplatform/controllers/dm-xplatform-message/dm-xplatform-message.html',
                        controller: 'dmXplatformMessage'
                    },
                    mid: {
                        templateUrl: '/static/dm-xplatform/controllers/dm-xplatform-observed/dm-xplatform-observed.html',
                        controller: 'dmXplatformObserved'
                    }
                },
                onEnter: function ($rootScope) {
                    $rootScope.xplatformData.columns = {
                        left: 8,
                        mid: 4,
                        right: 0
                    };
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
