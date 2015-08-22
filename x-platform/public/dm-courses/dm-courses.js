import app from './dm-courses-app';
import bootstrap from 'slider/bootstrap';

app.config(['$stateProvider', '$urlRouterProvider',
  function ($stateProvider, $urlRouterProvider) {
    $stateProvider.state('index', {
      url: '/courses'
    });

    // TODO [ToDr] Common login screen and redirections mechanism
    /* $stateProvider.state('index.login', {
        anonymous: false,
        url: '/login',
        views: {
            left: {
              template: costam
            }
        },
    });
    */

    $urlRouterProvider.when('/', '/courses');
    $urlRouterProvider.otherwise('/courses');
  }
]);
bootstrap('dm-courses');
