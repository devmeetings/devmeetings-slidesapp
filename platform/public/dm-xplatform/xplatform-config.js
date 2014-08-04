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
    'xplatform/controllers/dm-xplatform-stream/dm-xplatform-stream',
    'xplatform/controllers/dm-xplatform-event/dm-xplatform-event',
    'xplatform/controllers/dm-xplatform-technology/dm-xplatform-technology',
    'xplatform/controllers/dm-xplatform-profile/dm-xplatform-profile',
    'xplatform/controllers/dm-xplatform-options/dm-xplatform-options'
], function(angular, angularRouter, bootstrap, xplatformApp) {
    xplatformApp.config(['$stateProvider', '$urlRouterProvider',
        function($stateProvider, $urlRouterProvider) {

            $stateProvider.state('index', {
                views: {
                    navbar: {
                        templateUrl: '/static/dm-xplatform/controllers/dm-xplatform-navbar/xplatform-navbar.html',
                        controller: 'XplatformNavbarCtrl'
                    },
                    content: {
                        templateUrl: '/static/dm-xplatform/controllers/dm-xplatform-index/xplatform-index.html',
                        controller: 'XplatformIndexCtrl'
                    }
                },
                onEnter: function ($rootScope) {
                    $rootScope.xplatformData = {
                        navbar: {},
                        columns: {}
                    };
                }
            });
           
            $stateProvider.state('index.stream', {
                url: '/stream',
                views: {
                    left: {
                        templateUrl: '/static/dm-xplatform/controllers/dm-xplatform-leftbar/dm-xplatform-leftbar.html',
                        controller: 'dmXplatformLeftbar'
                    },
                    mid: {
                        templateUrl: '/static/dm-xplatform/controllers/dm-xplatform-stream/dm-xplatform-stream.html',
                        controller: 'dmXplatformStream'
                    },
                    right: {
                        templateUrl: '/static/dm-xplatform/controllers/dm-xplatform-observed/dm-xplatform-observed.html',
                        controller: 'dmXplatformObserved'
                    }
                },
                onEnter: function ($rootScope) {
                    $rootScope.xplatformData.navbar = {
                        showTitle: true,
                        title: 'News Feed',
                        searchText: ''
                    };
                    $rootScope.xplatformData.columns = {
                        left: 2,
                        mid: 7,
                        right: 3
                    };
                }
            });
            
            $stateProvider.state('index.menu', {
                url: '/training/:type',
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
                    $rootScope.xplatformData.navbar = {
                        showTitle: true,
                        title: 'Tutoriale',
                        searchText: ''
                    };
                    $rootScope.xplatformData.columns = {
                        left: 2,
                        mid: 10,
                        right: 0
                    };
                }
            });
            
            $stateProvider.state('index.event', {
                url: '/event/:id',
                views: {
                    left: {
                        templateUrl: '/static/dm-xplatform/controllers/dm-xplatform-leftbar/dm-xplatform-leftbar.html',
                        controller: 'dmXplatformLeftbar'
                    },
                    mid: {
                        templateUrl: '/static/dm-xplatform/controllers/dm-xplatform-event/dm-xplatform-event.html',
                        controller: 'dmXplatformEvent'
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
            
            
            $stateProvider.state('index.technology', {
                url: '/technology/:name',
                views: {
                    left: {
                        templateUrl: '/static/dm-xplatform/controllers/dm-xplatform-leftbar/dm-xplatform-leftbar.html',
                        controller: 'dmXplatformLeftbar'
                    },
                    mid: {
                        templateUrl: '/static/dm-xplatform/controllers/dm-xplatform-technology/dm-xplatform-technology.html',
                        controller: 'dmXplatformTechnology'
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
            
            $stateProvider.state('index.devhero', {
                url: '/devhero/:id',
                views: {
                    left: {
                        templateUrl: '/static/dm-xplatform/controllers/dm-xplatform-devhero/dm-xplatform-devhero.html',
                        controller: 'dmXplatformDevhero'
                    },
                    mid: {
                        templateUrl: '/static/dm-xplatform/controllers/dm-xplatform-stream/dm-xplatform-stream.html',
                        controller: 'dmXplatformStream'
                    },
                    right: {
                        templateUrl: '/static/dm-xplatform/controllers/dm-xplatform-observed/dm-xplatform-observed.html',
                        controller: 'dmXplatformObserved'
                    }
                },
                onEnter: function ($rootScope) {
                    $rootScope.xplatformData.columns = {
                        left: 3,
                        mid: 6,
                        right: 3
                    };
                }
            });

            $stateProvider.state('index.message', {
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
            
            $stateProvider.state('index.profile', {
                url: '/profile',
                views: {
                    left: {
                        templateUrl: '/static/dm-xplatform/controllers/dm-xplatform-profile/dm-xplatform-profile.html',
                        controller: 'dmXplatformProfile'
                    },
                    mid: {
                        templateUrl: '/static/dm-xplatform/controllers/dm-xplatform-options/dm-xplatform-options.html',
                        controller: 'dmXplatformObserved'
                    }
                },
                onEnter: function ($rootScope) {
                    $rootScope.xplatformData.navbar = {
                        showTitle: true,
                        title: 'Edycja profilu',
                        searchText: ''
                    };
                    $rootScope.xplatformData.columns = {
                        left: 8,
                        mid: 4,
                        right: 0
                    };
                }
            });

            $stateProvider.state('index.player', {
                url: '/player/:event/:id',
                views: {
                    left: {
                        templateUrl: '/static/dm-xplatform/controllers/dm-xplatform-player/dm-xplatform-player.html',
                        controller: 'dmXplatformPlayer'
                    }
                },
                onEnter: function ($rootScope) {
                    $rootScope.xplatformData.columns = {
                        left: 12,
                        mid: 0,
                        right: 0
                    };
                }
            });

            $stateProvider.state('index.player.chapter', {
                url: '/:index',
                views: {
                    chapter: {
                        templateUrl: '/static/dm-xplatform/controllers/dm-xplatform-chapter/dm-xplatform-chapter.html',
                        controller: 'dmXplatformChapter'
                    }
                }
            });

            $urlRouterProvider.when('/player/', '/player/53ce34758fb745d156d54301/0');
            $urlRouterProvider.when('/', '/stream');
            $urlRouterProvider.otherwise('/stream');
        }
    ]);
    bootstrap('xplatform');
});
