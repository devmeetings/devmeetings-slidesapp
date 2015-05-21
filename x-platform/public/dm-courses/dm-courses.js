requirejs(['angular',
        'templates',
        'dm-courses/dm-courses-app',
        // TODO [ToDr] Move bootstrap to common module
        'slider/bootstrap'
    ],
    function(angular, templates, app, bootstrap) {



        app.config(['$stateProvider', '$urlRouterProvider',
            function($stateProvider, $urlRouterProvider) {


                $stateProvider.state('index', {
                    url: '/courses'
                });

                // TODO [ToDr] Common login screen and redirections mechanism
                /*$stateProvider.state('index.login', {
                    anonymous: false,
                    url: '/login',
                    views: {
                        left: {
                            templateUrl: '/static/dm-xplatform/controllers/dm-xplatform-login/dm-xplatform-login.html'
                        }
                    },
                });*/

                $urlRouterProvider.when('/', '/courses');
                $urlRouterProvider.otherwise('/courses');
            }
        ]);
        bootstrap('dm-courses');
    });
