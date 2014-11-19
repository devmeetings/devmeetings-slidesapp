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
                    ws.type = 'area';
                    ws.chart = $scope.getChartData(timeline);
                });
            };

            $scope.getChartData = function(timeline) {
                var min = new Date(timeline[0].createTime).getTime() || 0;

                function norm(x) {
                    return x || 0;
                }
                return {
                    series: ["html", "js", "css", '#files * 100'],
                    data: timeline.map(function(t) {
                        return {
                            x: new Date(t.createTime).getTime() - min,
                            y: [
                                norm(t.files['html']),
                                norm(t.files['js']),
                                norm(t.files['css']),
                                norm(t.fileNames.length * 100)
                            ],
                            tooltip: t.createTime
                        };
                    })
                };
            };

            $scope.chartTypes = ['area', 'line', 'bar', 'point', 'pie'];

            $scope.chartConfig = {
                tooltips: true,
                click: function(d) {
                    console.log(d);
                },
                legend: {
                    display: true, // can be either 'left' or 'right'.
                    position: 'left',
                    // you can have html in series name
                    htmlEnabled: false
                },
                isAnimate: true, // run animations while rendering chart
            };
        }
    ]);

});
