require(['angular',
    'templates',
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
    'xplatform/controllers/dm-xplatform-slide/dm-xplatform-slide',
    'xplatform/controllers/dm-xplatform-options/dm-xplatform-options',
    'xplatform/controllers/dm-xplatform-workshopdesc/dm-xplatform-workshopdesc',
    'xplatform/controllers/dm-xplatform-workshoplist/dm-xplatform-workshoplist',
    'xplatform/controllers/dm-xplatform-paypageprice/dm-xplatform-paypageprice',
    'xplatform/controllers/dm-xplatform-paypageprice/dm-xplatform-paypagethanks',
    'xplatform/controllers/dm-xplatform-info/dm-xplatform-info',

], function(angular, templates, angularRouter, bootstrap, xplatformApp) {

    xplatformApp.run(['$rootScope', '$state', '$modal',
        function($rootScope, $state, $modal) {
            $rootScope.$on('$stateChangeStart', function(event, toState, toStateParams) {
                if (toState.anonymous) { // or is authenticated
                    return;
                }

                event.preventDefault();

                if (toState.anonymousForceRegister) {
                    $modal.open({
                        templateUrl: '/static/dm-xplatform/controllers/dm-xplatform-register/dm-xplatform-register.html',
                        size: 'lg'
                    });
                    return;
                }

                $modal.open({
                    templateUrl: '/static/dm-xplatform/controllers/dm-xplatform-login/dm-xplatform-login.html',
                    size: 'sm'
                });


            });
        }
    ]);

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
                onEnter: function($rootScope) {
                    $rootScope.xplatformData = {
                        navbar: {},
                        columns: {}
                    };
                }
            });

            $stateProvider.state('index.login', {
                anonymous: false,
                url: '/login',
                views: {
                    left: {
                        templateUrl: '/static/dm-xplatform/controllers/dm-xplatform-login/dm-xplatform-login.html'
                    }
                },
                onEnter: function($rootScope) {
                    $rootScope.xplatformData.navbar = {
                        showTitle: true,
                        title: 'Zaloguj',
                        searchText: ''
                    },
                    $rootScope.xplatformData.columns = {
                        left: 12,
                        mid: 0,
                        right: 0
                    }
                }
            });

            $stateProvider.state('index.register', {
                anonymous: false,
                anonymousForceRegister: true,
                url: '/register',
                views: {
                    right: {
                        templateUrl: '/static/dm-xplatform/controllers/dm-xplatform-register/dm-xplatform-register.html'
                    }
                },
                onEnter: function($rootScope) {
                    $rootScope.xplatformData.navbar = {
                        showTitle: true,
                        title: 'Zarejestruj',
                        searchText: ''
                    },
                    $rootScope.xplatformData.columns = {
                        left: 0,
                        mid: 0,
                        right: 12
                    }
                }
            });

            $stateProvider.state('index.stream', {
                anonymous: true,
                url: '/newsfeed',
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
                onEnter: function($rootScope) {
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
                anonymous: true,
                url: '/tutorials/:type',
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
                onEnter: function($rootScope) {
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
                onEnter: function($rootScope) {
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
                onEnter: function($rootScope) {
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
                onEnter: function($rootScope) {
                    $rootScope.xplatformData.columns = {
                        left: 3,
                        mid: 6,
                        right: 3
                    };
                }
            });

            $stateProvider.state('index.courses', {
                anonymous: true,
                url: '/courses',
                views: {
                    left: {
                        templateUrl: '/static/dm-xplatform/controllers/dm-xplatform-leftbar/dm-xplatform-leftbar.html',
                        controller: 'dmXplatformLeftbar'
                    },
                    mid: {
                        templateUrl: '/static/dm-xplatform/controllers/dm-xplatform-workshoplist/dm-xplatform-workshoplist.html',
                        controller: 'dmXplatformWorkshoplist'
                    }
                },
                onEnter: function($rootScope) {
                    $rootScope.xplatformData.navbar = {
                        showTitle: true,
                        title: 'Kursy',
                        searchText: ''
                    };
                    $rootScope.xplatformData.columns = {
                        left: 2,
                        mid: 10,
                        right: 0
                    };
                }
            });

            $stateProvider.state('index.coursesDesc', {
                anonymous: true,
                url: '/courses/:id',
                views: {
                    left: {
                        templateUrl: '/static/dm-xplatform/controllers/dm-xplatform-leftbar/dm-xplatform-leftbar.html',
                        controller: 'dmXplatformLeftbar'
                    },
                    mid: {
                        templateUrl: '/static/dm-xplatform/controllers/dm-xplatform-workshopdesc/dm-xplatform-workshopdesc.html',
                        controller: 'dmXplatformWorkshopdesc'
                    },
                    right: {
                        templateUrl: '/static/dm-xplatform/controllers/dm-xplatform-paypageprice/dm-xplatform-paypageprice.html',
                        controller: 'dmXplatformPaypageprice'
                    }
                },
                onEnter: function($rootScope) {
                    $rootScope.xplatformData.navbar = {
                        showTitle: true,
                        title: 'Kursy',
                        searchText: ''
                    };
                    $rootScope.xplatformData.columns = {
                        left: 2,
                        mid: 7,
                        right: 3
                    };
                }
            });

            $stateProvider.state('index.paymentThanks', {
                url: '/thanks/:id/:price/:subscription',
                views: {
                    left: {
                        templateUrl: '/static/dm-xplatform/controllers/dm-xplatform-leftbar/dm-xplatform-leftbar.html',
                        controller: 'dmXplatformLeftbar'
                    },
                    right: {
                        templateUrl: '/static/dm-xplatform/controllers/dm-xplatform-paypageprice/dm-xplatform-paypagethanks.html',
                        controller: 'dmXplatformPaypagethanks'
                    }
                },
                onEnter: function($rootScope) {
                    $rootScope.xplatformData.navbar = {
                        showTitle: true,
                        title: 'Dzięki!',
                        searchText: ''
                    };
                    $rootScope.xplatformData.columns = {
                        left: 2,
                        mid: 0,
                        right: 10
                    };
                }
            });

            $stateProvider.state('index.paymentInfo', {
                url: '/info/:id',
                views: {
                    left: {
                        templateUrl: '/static/dm-xplatform/controllers/dm-xplatform-leftbar/dm-xplatform-leftbar.html',
                        controller: 'dmXplatformLeftbar'
                    },
                    mid: {
                        templateUrl: '/static/dm-xplatform/controllers/dm-xplatform-info/dm-xplatform-info.html',
                        controller: 'dmXplatformInfo'
                    },
                    right: {
                        templateUrl: '/static/dm-xplatform/controllers/dm-xplatform-paypageprice/dm-xplatform-paypageprice.html',
                        controller: 'dmXplatformPaypageprice'
                    }
                },
                onEnter: function($rootScope) {
                    $rootScope.xplatformData.navbar = {
                        showTitle: true,
                        title: 'Info',
                        searchText: ''
                    };
                    $rootScope.xplatformData.columns = {
                        left: 2,
                        mid: 7,
                        right: 3
                    };
                }
            });

            $stateProvider.state('index.paymentSubscription', {
                url: '/subscription/:id',
                views: {
                    left: {
                        templateUrl: '/static/dm-xplatform/controllers/dm-xplatform-leftbar/dm-xplatform-leftbar.html',
                        controller: 'dmXplatformLeftbar'
                    },
                    mid: {
                        templateUrl: '/static/dm-xplatform/controllers/dm-xplatform-subscription/dm-xplatform-subscription.html'
                    },
                    right: {
                        templateUrl: '/static/dm-xplatform/controllers/dm-xplatform-paypageprice/dm-xplatform-paypageprice.html',
                        controller: 'dmXplatformPaypageprice'
                    }
                },
                onEnter: function($rootScope) {
                    $rootScope.xplatformData.navbar = {
                        showTitle: true,
                        title: 'Abonament',
                        searchText: ''
                    };
                    $rootScope.xplatformData.columns = {
                        left: 2,
                        mid: 7,
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
                onEnter: function($rootScope) {
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
                onEnter: function($rootScope) {
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

            $stateProvider.state('index.task', {
                url: '/task/:event/:id',
                views: {
                    left: {
                        templateUrl: '/static/dm-xplatform/controllers/dm-xplatform-slide/dm-xplatform-slide.html',
                        controller: 'dmXplatformSlide'
                    }
                },
                onEnter: function($rootScope) {
                    $rootScope.xplatformData.navbar = {
                        showTitle: true,
                        title: 'Slide',
                        searchText: ''
                    };
                    $rootScope.xplatformData.columns = {
                        left: 12,
                        mid: 0,
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
                onEnter: function($rootScope) {
                    $rootScope.xplatformData.columns = {
                        left: 12,
                        mid: 0,
                        right: 0
                    };
                    $rootScope.xplatformData.navbar = {
                        showTitle: true,
                        title: 'Tutorial',
                        searchText: ''
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
            $urlRouterProvider.when('/', '/courses');
            $urlRouterProvider.otherwise('/courses');
        }
    ]);
    bootstrap('xplatform');
});