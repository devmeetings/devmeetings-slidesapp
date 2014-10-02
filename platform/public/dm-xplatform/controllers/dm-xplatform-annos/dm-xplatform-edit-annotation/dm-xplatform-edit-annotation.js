define(['angular', 'xplatform/xplatform-app'], function(angular, xplatformApp) {
    xplatformApp.directive('dmXplatformEditAnnotation', [
        'dmEvents',
        function(dmEvents) {


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
                            dmEvents.addEventAnnotation(scope.eventId, snippet).then(function(ev){
                                snippet._id = ev.data._id;
                            });
                        } else {
                            dmEvents.editEventAnnotation(scope.eventId, snippet);
                        }
                    };

                    scope.delete = function(snippet) {
                        dmEvents.deleteEventAnnotation(scope.eventId, snippet);
                    };
                }
            };
        }
    ]);
});