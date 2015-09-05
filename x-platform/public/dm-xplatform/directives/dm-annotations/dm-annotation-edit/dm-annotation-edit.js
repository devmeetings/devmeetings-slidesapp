/* globals define */
define(['angular', 'dm-xplatform/xplatform-app', './dm-annotation-edit.html!text'], function (angular, xplatformApp, viewTemplate) {
  xplatformApp.directive('dmAnnotationEdit', [
    'dmEvents', '$rootScope',
    function (dmEvents, $rootScope) {
      return {
        restrict: 'E',
        scope: {
          simple: '=?',
          currentSecond: '=?',
          snippet: '=',
          eventId: '=',
          iterationId: '=',
          materialId: '=',
          resetSnippet: '&',
          annotations: '='
        },
        template: viewTemplate,
        link: function (scope) {
          scope.saveSimple = function (snippet) {
            snippet.timestamp = scope.currentSecond;
            snippet.type = 'comment';
            scope.save(snippet);
          };
          scope.save = function (snippet) {
            var newSnippet = !snippet._id;

            if (newSnippet) {
              dmEvents.addEventAnnotation(scope.eventId, scope.iterationId, scope.materialId, snippet, scope.annotations).then(function (ev) {
                scope.resetSnippet();
              });
            } else {
              dmEvents.editEventAnnotation(scope.eventId, scope.iterationId, scope.materialId, snippet);
            }

            // TODO [ToDr] :(
            $rootScope.$broadcast('newAnnotations');
          };

          scope.addPause = function (snippet) {
            snippet.title = 'Pause';
            snippet.type = 'pause';
            scope.save(snippet);
          };

          scope.delete = function (snippet) {
            dmEvents.deleteEventAnnotation(scope.eventId, scope.iterationId, scope.materialId, snippet);
          };
        }
      };
    }
  ]);
});
