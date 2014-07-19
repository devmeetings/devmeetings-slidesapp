require(['angular',
        'angular-ui-router',
        'dm-admin/dm-admin-app',
        'dm-admin/controllers/dm-admin-slider/dm-admin-slider',
        'dm-admin/controllers/dm-admin-trainings/dm-admin-trainings',
        'dm-admin/controllers/dm-admin-decks/dm-admin-decks',
        'dm-admin/controllers/dm-admin-player/dm-admin-player',
], function (angular, angularRouter, adminApp, adminSlider) {
    adminApp.config(['$stateProvider', '$urlRouterProvider',
        function ($stateProvider, $urlRouterProvider) {
        
            var getControllerTemplate = function (name) {
                return '/static/dm-admin/controllers/' + name + '/' + name + '.html';
            };
            
            $stateProvider.state('index', {
                url: '',
                templateUrl: getControllerTemplate('dm-admin-slider'),
                controller: 'dmAdminSlider'
            });


            $stateProvider.state('index.trainings', {
                url: '/trainings',
                views: {
                    content: {
                        templateUrl: getControllerTemplate('dm-admin-trainings'),
                        controller: 'dmAdminTrainings'
                    }
                }
            });

            $stateProvider.state('index.decks', {
                url: '/decks',
                views: {
                    content: {
                        templateUrl: getControllerTemplate('dm-admin-decks'),
                        controller: 'dmAdminDecks'
                    }
                }
            });


            $stateProvider.state('index.trainings.player', {
                url: '/:title',
                views: {
                    training: {
                        templateUrl: getControllerTemplate('dm-admin-player'),
                        controller: 'dmAdminPlayer'
                    }
                }
            });

            $urlRouterProvider.otherwise('');
        }
    ]);
    angular.bootstrap(document, ['dm-admin']);
});
