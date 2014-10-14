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


            });

            $scope.fetchRecentWorkspaces = function(ws) {
                dmWorkspaces.getUserAllPages(ws.user._id).then(function(userPages) {
                    ws.userPages = userPages;
                });
            };

            $scope.keys = function(array) {
                return Object.keys(array);
            };

            $scope.fetchTimeline = function(ws) {
                dmWorkspaces.getUserTimeline(ws.user._id).then(function(timeline) {
                    ws.timeline = timeline;
                    ws.chart = $scope.getChartData(timeline);
                });
            };

            $scope.getChartData = function(timeline) {
                var min = new Date(timeline[0].createTime).getTime();
                return {
                    series: ["html", "js", "css"],
                    data: timeline.map(function(t) {
                        console.log(t);
                        return {
                            x: new Date(t.createTime).getTime() - min,
                            y: [t.files['html'] || 0, t.files['js'] || 0, t.files['css'] || 0],
                            tooltip: t.hash
                        };
                    })
                };
            };
        }
    ]);

});