require(['angular',
        'templates',
        'angular-ui-router',
        'slider/bootstrap',
        'xplatform/xplatform-app',
        'xplatform/controllers/dm-xplatform-navbar/xplatform-navbar',
        'xplatform/controllers/dm-xplatform-index/xplatform-index',
        'directives/plugins-loader',
        'xplatform/controllers/dm-xplatform-trainer/dm-xplatform-trainer',
        'xplatform/controllers/dm-xplatform-player/dm-xplatform-player',
        'xplatform/controllers/dm-xplatform-devhero/dm-xplatform-devhero',
        'xplatform/controllers/dm-xplatform-leftbar/dm-xplatform-leftbar',
        'xplatform/controllers/dm-xplatform-observed/dm-xplatform-observed',
        'xplatform/controllers/dm-xplatform-stream/dm-xplatform-stream',
        'xplatform/controllers/dm-xplatform-profile/dm-xplatform-profile',
        'xplatform/controllers/dm-xplatform-slide/dm-xplatform-slide',
        'xplatform/controllers/dm-xplatform-options/dm-xplatform-options',
        'xplatform/controllers/dm-xplatform-workshoplist/dm-xplatform-workshoplist',
        'xplatform/controllers/dm-xplatform-login/dm-xplatform-login',
        'xplatform/controllers/dm-xplatform-register/dm-xplatform-register',
        'xplatform/controllers/dm-xplatform-space/dm-xplatform-space',
        'xplatform/controllers/dm-xplatform-timeline/dm-xplatform-timeline',
        'xplatform/controllers/dm-xplatform-todo/dm-xplatform-todo',
        'xplatform/controllers/dm-xplatform-ranking/dm-xplatform-ranking',
        'xplatform/controllers/dm-xplatform-annos/dm-xplatform-annos',
        'xplatform/controllers/dm-xplatform-question/dm-xplatform-question',
        'xplatform/controllers/dm-xplatform-question-answer/dm-xplatform-question-answer',
        'xplatform/controllers/dm-xplatform-question-create/dm-xplatform-question-create',
        'xplatform/controllers/dm-xplatform-deck/dm-xplatform-deck',
        'xplatform/controllers/dm-xplatform-deck-slide/dm-xplatform-deck-slide'
    ],
    function(angular, templates, angularRouter, bootstrap, xplatformApp) {

        xplatformApp.run(['$rootScope', '$state', '$modal', '$location', 'dmUser',
            function($rootScope, $state, $modal, $location, dmUser) {

                $rootScope.$on('$stateChangeStart', function(event, toState, toStateParams) {
                    if (toState.name === 'redirect') {
                        var destination = localStorage['redirectUrl'] || '/';
                        window.location.href = destination;
                        return;
                    }

                    if (toState.anonymous || dmUser.isLoggedIn()) {
                        return;
                    }

                    event.preventDefault();

                    localStorage['redirectUrl'] = $location.$$absUrl;
                    if (toState.anonymousForceRegister) {
                        $modal.open({
                            templateUrl: '/static/dm-xplatform/controllers/dm-xplatform-register/dm-xplatform-register.html',
                            controller: 'dmXplatformRegister',
                            size: 'sm',
                            windowClass: 'login-modal'
                        });
                        return;
                    }

                    $modal.open({
                        templateUrl: '/static/dm-xplatform/controllers/dm-xplatform-login/dm-xplatform-login.html',
                        controller: 'dmXplatformLogin',
                        size: 'sm',
                        windowClass: 'login-modal'
                    });
                });
            }
        ]);

        xplatformApp.config(['$stateProvider', '$urlRouterProvider',
            function($stateProvider, $urlRouterProvider) {

                $stateProvider.state('redirect', {
                    url: '/redirect'
                });

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
                            title: 'Log in',
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
                            title: 'Register',
                            searchText: ''
                        },
                        $rootScope.xplatformData.columns = {
                            left: 0,
                            mid: 0,
                            right: 12
                        }
                    }
                });

                $stateProvider.state('index.privacy', {
                    anonymous: true,
                    url: '/privacy',
                    views: {
                        left: {
                            templateUrl: '/static/dm-xplatform/controllers/dm-xplatform-privacy/dm-xplatform-privacy.html'
                        }
                    },
                    onEnter: function($rootScope) {
                        $rootScope.xplatformData.navbar = {
                            title: 'Polityka prywatności',
                            showTitle: true,
                            searchText: ''
                        },
                        $rootScope.xplatformData.columns = {
                            left: 12,
                            mid: 0,
                            right: 0
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
                        mid: {
                            templateUrl: '/static/dm-xplatform/controllers/dm-xplatform-workshoplist/dm-xplatform-workshoplist.html',
                            controller: 'dmXplatformWorkshoplist'
                        }
                    },
                    onEnter: function($rootScope) {
                        $rootScope.xplatformData.navbar = {
                            showTitle: true,
                            title: 'Workshops',
                            searchText: ''
                        };
                        $rootScope.xplatformData.columns = {
                            left: 0,
                            mid: 12,
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

                $stateProvider.state('index.space', {
                    url: '/space/:event',
                    views: {
                        mid: {
                            templateUrl: '/static/dm-xplatform/controllers/dm-xplatform-space/dm-xplatform-space.html',
                            controller: 'dmXplatformSpace'
                        },
                    },
                    onEnter: function($rootScope) {
                        $rootScope.xplatformData.columns = {
                            left: 0,
                            mid: 12,
                            right: 0
                        };
                        $rootScope.xplatformData.navbar = {
                            showTitle: true,
                            title: ''
                        };
                        $rootScope.headerHidden = true;
                    },
                    onExit: function($rootScope) {
                        $rootScope.headerHidden = false;
                    }
                });

                $stateProvider.state('index.space.slide', {
                    url: '/slide/:slide',
                    views: {
                        content: {
                            templateUrl: '/static/dm-xplatform/controllers/dm-xplatform-deck-slide/dm-xplatform-deck-slide.html',
                            controller: 'dmXplatformDeckSlide'
                        },
                        first: {
                            templateUrl: '/static/dm-xplatform/controllers/dm-xplatform-annos/dm-xplatform-annos.html',
                            controller: 'dmXplatformAnnos'
                        }
                    }
                });

                $stateProvider.state('index.space.question', {
                    url: '/question/:slide?parent',
                    views: {
                        content: {
                            templateUrl: '/static/dm-xplatform/controllers/dm-xplatform-slide/dm-xplatform-slide.html',
                            controller: 'dmXplatformSlide'
                        },
                        first: {
                            templateUrl: '/static/dm-xplatform/controllers/dm-xplatform-annos/dm-xplatform-annos.html',
                            controller: 'dmXplatformAnnos'
                        }
                    }
                });

                $stateProvider.state('index.space.workspace', {
                    url: '/workspace/:slide',
                    views: {
                        content: {
                            templateUrl: '/static/dm-xplatform/controllers/dm-xplatform-slide/dm-xplatform-slide.html',
                            controller: 'dmXplatformSlide'
                        },
                        first: {
                            templateUrl: '/static/dm-xplatform/controllers/dm-xplatform-annos/dm-xplatform-annos.html',
                            controller: 'dmXplatformAnnos'
                        }
                    }
                });

                $stateProvider.state('index.space.todo', {
                    url: '/todo/:iteration/:todo',
                    views: {
                        content: {
                            templateUrl: '/static/dm-xplatform/controllers/dm-xplatform-todo/dm-xplatform-todo.html',
                            controller: 'dmXplatformTodo'
                        },
                        first: {
                            templateUrl: '/static/dm-xplatform/controllers/dm-xplatform-annos/dm-xplatform-annos.html',
                            controller: 'dmXplatformAnnos'
                        }
                    }
                });

                $stateProvider.state('index.space.deck', {
                    url: '/deck/:iteration/:deck?from&to',
                    views: {
                        content: {
                            templateUrl: '/static/dm-xplatform/controllers/dm-xplatform-deck/dm-xplatform-deck.html',
                            controller: 'dmXplatformDeck'
                        },
                        first: {
                            templateUrl: '/static/dm-xplatform/controllers/dm-xplatform-annos/dm-xplatform-annos.html',
                            controller: 'dmXplatformAnnos'
                        }
                    }
                });

                $stateProvider.state('index.space.player', {
                    url: '/player/:iteration/:material?withVoice',
                    views: {
                        content: {
                            templateUrl: '/static/dm-xplatform/controllers/dm-xplatform-player/dm-xplatform-player.html',
                            controller: 'dmXplatformPlayer'
                        },
                        bottombar: {
                            templateUrl: '/static/dm-xplatform/controllers/dm-xplatform-timeline/dm-xplatform-timeline.html',
                            controller: 'dmXplatformTimeline'
                        },
                        first: {
                            templateUrl: '/static/dm-xplatform/controllers/dm-xplatform-annos/dm-xplatform-annos.html',
                            controller: 'dmXplatformAnnos'
                        }
                    }
                });

                $stateProvider.state('index.space.ranking', {
                    url: '/ranking',
                    views: {
                        content: {
                            templateUrl: '/static/dm-xplatform/controllers/dm-xplatform-ranking/dm-xplatform-ranking.html',
                            controller: 'dmXplatformRanking'
                        },
                        first: {
                            templateUrl: '/static/dm-xplatform/controllers/dm-xplatform-annos/dm-xplatform-annos.html',
                            controller: 'dmXplatformAnnos'
                        }
                    }
                });

                $stateProvider.state('index.space.trainer', {
                    url: '/trainer',
                    views: {
                        content: {
                            templateUrl: '/static/dm-xplatform/controllers/dm-xplatform-trainer/dm-xplatform-trainer.html',
                            controller: 'dmXplatformTrainer'
                        }
                    }
                });

                $urlRouterProvider.when('/', '/courses');
                $urlRouterProvider.otherwise('/courses');
            }
        ]);
        bootstrap('xplatform');
    });