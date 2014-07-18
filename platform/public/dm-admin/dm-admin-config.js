require(['angular',
        'angular-ui-router',
        'dm-admin/dm-admin-app',
        'dm-admin/controllers/dm-admin-slider/dm-admin-slider',
], function (angular, angularRouter, adminApp, adminSlider) {
    adminApp.config(['$stateProvider', '$urlRouterProvider',
        function ($stateProvider, $urlRouterProvider) {
        
            var getControllerTemplate = function (name) {
                return '/static/dm-admin/controllers/' + name + '/' + name + '.html';
            };
            
            $stateProvider.state('index', {
                url: '/',
                templateUrl: getControllerTemplate('dm-admin-slider'),
                controller: 'dmAdminSlider'
            });

            $urlRouterProvider.otherwise('/');
        }
    ]);
    angular.bootstrap(document, ['dm-admin']);
});
