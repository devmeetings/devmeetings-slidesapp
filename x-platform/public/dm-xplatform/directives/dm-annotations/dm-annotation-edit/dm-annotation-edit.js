define(['angular', 'xplatform/xplatform-app'], function(angular, xplatformApp) {
  xplatformApp.directive('dmAnnotationEdit', [
    'dmEvents', '$rootScope',
    function(dmEvents, $rootScope) {
      return {
        restrict: 'E',
        scope: {
          simple: '=?',
          currentSecond: '=?',
          snippet: '=',
          eventId: '=',
          iterationId: '=',
          materialId: '=',
          resetSnippet: '&'
        },
        templateUrl: '/static/dm-xplatform/directives/dm-annotations/dm-annotation-edit/dm-annotation-edit.html',
        link: function(scope) {

          scope.saveSimple = function(snippet) {
            snippet.timestamp = scope.currentSecond;
            snippet.type = 'comment';
            scope.save(snippet);
          };
          scope.save = function(snippet) {
            var newSnippet = !snippet._id;

            if (newSnippet) {
              dmEvents.addEventAnnotation(scope.eventId, scope.iterationId, scope.materialId, snippet).then(function(ev) {
                scope.resetSnippet();
              });
            } else {
              dmEvents.editEventAnnotation(scope.eventId, scope.iterationId, scope.materialId, snippet);
            }

            // TODO [ToDr] :(
            $rootScope.$broadcast('newAnnotations');

          };

          scope.addPause = function(snippet) {
            snippet.title = "Pause";
            snippet.type = 'pause';
            scope.save(snippet);
          };

          scope.delete = function(snippet) {
            dmEvents.deleteEventAnnotation(scope.eventId, scope.iterationId, scope.materialId, snippet);
          };
        }
      };
    }
  ]);
});
