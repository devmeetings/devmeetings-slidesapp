define(['angular',
        'xplatform/xplatform-app'
], function (angular, xplatformApp) {
    xplatformApp.controller('dmXplatformStream', ['$scope', '$stateParams', '$modal', 'dmStream', function ($scope, $stateParams, $modal, dmStream) {
        if ($stateParams.id) {
            dmStream.getUserStream($stateParams.id).then(function (data) {
                $scope.stream = data;
            });
        } else {
            dmStream.getStream().then(function (data) {
                $scope.stream = data;
            });
        }

        var detailsGroup = {
            'video.start' : {
                getText: function () {
                    return 'rozpoczął tutorial'
                },
                getLink: function(event, link) {
                    return 'index.player.chapter({id: "' + link + '", index: "0", event: "' + event + '"})';
                }
            },
            'video.done' : {
                getText: function () {
                    return 'ukończył tutorial'
                },
                getLink: function(event, link) {
                    return 'index.player.chapter({id: "' + link + '", index: "0", event: "' + event + '"})';
                }
            },
            'task.done' : {
                getText: function () {
                    return 'ukończył zadanie'
                },
                getLink: function(event, link) {
                    return 'index.task({id: "' + link + '", event: "' + event + '"})'; 
                }
            }
        };

        $scope.detailsForActivity = function (activity) {
            var det = detailsGroup[activity.type];
            var details = {
                title: activity.data.title,
                text: det.getText(),
                link: det.getLink(activity.data.eventId, activity.data.linkId)
            };
            return details;
        };

        
    }]);
});
