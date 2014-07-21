require(['angular',
        'angular-ui-router',
        'dm-admin/dm-admin-app',
        'dm-admin/controllers/dm-admin-slider/dm-admin-slider',
        'dm-admin/controllers/dm-admin-trainings/dm-admin-trainings',
        'dm-admin/controllers/dm-admin-decks/dm-admin-decks',
        'dm-admin/controllers/dm-admin-chapters/dm-admin-chapters',
        'dm-admin/controllers/dm-admin-chapter/dm-admin-chapter',
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


            $stateProvider.state('index.trainings.chapters', {
                url: '/:id',
                views: {
                    training: {
                        templateUrl: getControllerTemplate('dm-admin-chapters'),
                        controller: 'dmAdminChapters'
                    }
                }
            });

            $stateProvider.state('index.trainings.chapters.chapter', {
                url: '/:index',
                views: {
                    chapter: {
                        templateUrl: getControllerTemplate('dm-admin-chapter'),
                        controller: 'dmAdminChapter'
                    }
                }
            });

            $urlRouterProvider.otherwise('');
        }
    ]);
    angular.bootstrap(document, ['dm-admin']);
});
