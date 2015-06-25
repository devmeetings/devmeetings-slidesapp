define(['angular',
    'angular-ui-router',
    'slider/bootstrap',
    'dm-admin/dm-admin-app',
    'dm-admin/controllers/dm-admin-slider/dm-admin-slider',
    'dm-admin/controllers/dm-admin-quiz/dm-admin-quiz',
    'directives/plugins-loader'
], function(angular, angularRouter, bootstrap, adminApp, adminSlider) {

    adminApp.config(['$stateProvider', '$urlRouterProvider',
        function($stateProvider, $urlRouterProvider) {

            var getControllerTemplate = function(name) {
                return '/static/dm-admin/controllers/' + name + '/' + name + '.html';
            };

            $stateProvider.state('index', {
                url: '',
                templateUrl: getControllerTemplate('dm-admin-slider'),
                controller: 'dmAdminSlider'
            });


            $stateProvider.state('index.quiz', {
                url: '/quiz',
                views: {
                    content: {
                        templateUrl: getControllerTemplate('dm-admin-quiz'),
                        controller: 'dmAdminQuiz'
                    }
                }
            });

            $stateProvider.state('index.waves', {
                url: '/waves',
                views: {
                    content: {
                        templateUrl: getControllerTemplate('dm-admin-waves'),
                        controller: 'dmAdminWaves'
                    }
                }
            });

            $urlRouterProvider.otherwise('');
        }
    ]);
    bootstrap('dm-admin');
    //angular.bootstrap(document, ['dm-admin']);
});
