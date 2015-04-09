define([
    'angular', 'xplatform/xplatform-app',
    './services/dm-workspaces'
], function(angular, xplatformApp) {

    xplatformApp.controller('dmXplatformTrainer', [
        '$scope', '$stateParams', '$state', 'dmEvents', 'dmWorkspaces',

        function($scope, $stateParams, $state, dmEvents, dmWorkspaces) {
            var eventId = $stateParams.event;
            dmEvents.getEvent(eventId).then(function(event) {
                $scope.eventTitle = event.title;
                dmWorkspaces.getUsersWorkspaces(event._id).then(function(workspaces) {
                    $scope.workspaces = workspaces;
                });


            });

            $scope.fetchRecentWorkspaces = function(ws) {
                dmWorkspaces.getUserAllPages(ws.user._id).then(function(userPages) {
                    ws.userPages = userPages;
                });
            };

            $scope.convertRecentWorkspaces = function(ws) {
              dmWorkspaces.convertToRecording(ws.user._id, ws.user.name, $scope.eventTitle).then(function(recordingId){
                $state.go('index.player', {
                  id: recordingId.recordingId
                });
              });
            };

            $scope.keys = function(array) {
                return Object.keys(array);
            };
       }
    ]);

});
