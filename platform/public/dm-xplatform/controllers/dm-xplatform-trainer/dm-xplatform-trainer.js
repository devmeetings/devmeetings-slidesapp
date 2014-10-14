define([
    'angular', 'xplatform/xplatform-app', '_',
    './services/dm-workspaces'
], function(angular, xplatformApp, _) {

    xplatformApp.controller('dmXplatformTrainer', [
        '$scope', '$stateParams', 'dmEvents', 'dmWorkspaces',

        function($scope, $stateParams, dmEvents, dmWorkspaces) {
            var eventId = $stateParams.event;
            dmEvents.getEvent(eventId).then(function(event) {
                dmWorkspaces.getUsersWorkspaces(event.baseSlide).then(function(workspaces) {
                    $scope.workspaces = workspaces;
                });

                $scope.fetchRecentWorkspaces = function(ws) {
                    dmWorkspaces.getUserAllPages(ws.user._id).then(function(userPages) {
                        ws.userPages = userPages;
                    });
                };
            });

            $scope.keys = function(array) {
                return Object.keys(array);
            };
        }
    ]);

});