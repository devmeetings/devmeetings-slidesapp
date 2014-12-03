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
                    materialId: '='
                },
                templateUrl: '/static/dm-xplatform/controllers/dm-xplatform-annos/dm-xplatform-edit-annotation/index.html',
                link: function(scope) {
                    // TODO [ToDr] Refresh annotations?

                    scope.save = function(snippet) {
                        var newSnippet = !snippet._id;
                        
                        if (newSnippet) {
                            dmEvents.addEventAnnotation(scope.eventId, scope.iterationId, scope.materialId, snippet).then(function(ev){
                                scope.snippet = {};
                            });
                        } else {
                            dmEvents.editEventAnnotation(scope.eventId, scope.iterationId, scope.materialId, snippet);
                        }
                        // TODO [ToDr] :(
                        $rootScope.$broadcast('newAnnotations');
                    };

                    scope.delete = function(snippet) {
                        dmEvents.deleteEventAnnotation(scope.eventId, scope.iterationId, scope.materialId, snippet);
                    };
                }
            };
        }
    ]);
});
