define(['angular', 'dm-xplatform/xplatform-app', 'slider/slider.plugins',
  './dm-microtask-users.html!text', 'dm-xplatform/controllers/dm-xplatform-users/dm-xplatform-users.html!text',
  'dm-xplatform/services/dm-tasks/dm-tasks'], function (angular, xplatformApp, sliderPlugins, viewTemplate, modalTemplate) {
  sliderPlugins.registerPlugin('microtask', '*', 'microtask-users', 500).directive('microtaskUsers', [
    '$modal', 'dmTasks', function ($modal, dmTasks) {
      return {
        restrict: 'E',
        scope: {
          microtask: '=context'
        },
        template: viewTemplate,
        link: function (scope, element) {
          scope.showUsers = function (users) {
            var modalInstance = $modal.open({
              template: modalTemplate,
              controller: 'dmXplatformUsers',
              size: 'sm',
              resolve: {
                users: function () {
                  return users;
                }
              }
            });
          };

          dmTasks.getEventWithSlide().then(function (event) {
            var result = _.find(event.slides, function (task) {
              return task.task === scope.microtask.taskName;
            });

            scope.people = result.peopleFinished;
          });
        }
      };
    }
  ]);
});
