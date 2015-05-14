define(['angular', 'xplatform/xplatform-app'], function(angular, xplatformApp) {
  xplatformApp.directive('dmXplatformEditAnnotation', [
    'dmEvents', '$rootScope',
    function(dmEvents, $rootScope) {
      return {
        restrict: 'E',
        scope: {
          snippet: '=',
          eventId: '=',
          iterationId: '=',
          materialId: '=',
          resetSnippet: '&'
        },
        templateUrl: '/static/dm-xplatform/directives/dm-annotations/dm-annotation-edit/dm-annotation-edit.html',
        link: function(scope) {

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
