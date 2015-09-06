/* globals define */
define(['angular',
  'angular-ui-router',
  'slider/bootstrap',
  'dm-admin/dm-admin-app',
  './controllers/dm-admin-slider/dm-admin-slider.html!text',
  './controllers/dm-admin-quiz/dm-admin-quiz.html!text',
  'dm-admin/controllers/dm-admin-slider/dm-admin-slider',
  'dm-admin/controllers/dm-admin-quiz/dm-admin-quiz',
  'directives/plugins-loader'
], function (angular, angularRouter, bootstrap, adminApp, adminSliderView, adminQuizView) {
  adminApp.config(['$stateProvider', '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {
      $stateProvider.state('index', {
        url: '',
        template: adminSliderView,
        controller: 'dmAdminSlider'
      });

      $stateProvider.state('index.quiz', {
        url: '/quiz',
        views: {
          content: {
            template: adminQuizView,
            controller: 'dmAdminQuiz'
          }
        }
      });

      $urlRouterProvider.otherwise('/decks');
    }
  ]);
  bootstrap('dm-admin');
});
