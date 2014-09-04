define(['angular',
        '_',
        'xplatform/xplatform-app',
        'xplatform/directives/dm-timeline/dm-timeline',
        'xplatform/directives/dm-sidebar/dm-sidebar',
        'xplatform/controllers/dm-xplatform-edit-snippet/dm-xplatform-edit-snippet'
], function (angular, _, xplatformApp) {   
    xplatformApp.controller('dmXplatformPlayer', ['$scope', '$timeout', '$state', '$stateParams', '$http', '$q', '$modal', 'dmTrainings', 'dmUser',
        function ($scope, $timeout, $state, $stateParams, $http, $q, $modal, dmTrainings, dmUser) {

            $scope.editSnippet = function (snippet, type) {
                var newSnippet = !snippet;
                snippet = snippet || {
                    timestamp: $scope.state.currentSecond | 0,
                    markdown: ''
                };               
                $modal.open({
                    templateUrl: '/static/dm-xplatform/controllers/dm-xplatform-edit-snippet/index.html',
                    size: 'sm',
                    controller: 'dmXplatformEditSnippet',
                    resolve: {
                        editedContent: function () {
                            return snippet;
                        }, 
                        editedContentType: function () {
                            return type;
                        }
                    }
                }).result.then(function () {
                    if (newSnippet) {
                        if (type === 'snippet') {
                            $http.post('/api/add_event_snippet/' + $stateParams.event, snippet).then(function (data) {
                                $scope.snippets = $scope.snippets || [];
                                $scope.snippets.push(data.data);
                            });
                        } else if (type === 'task') {
                            $http.post('/api/add_event_task/' + $stateParams.event, snippet).then(function (data) {
                                $scope.tasks = $scope.tasks || [];
                                $scope.tasks.push(data.data);
                            });
                        }
                    } else {
                        if (type === 'snippet') {
                            $http.put('/api/edit_event_snippet/' + $stateParams.event + '/' + snippet._id, snippet);
                        } else if (type === 'task') {
                            $http.put('/api/edit_event_task/' + $stateParams.event + '/' + snippet._id, snippet); 
                        }
                    }
                });
            };

            $scope.deleteSnippet = function (snippet, type) {
                if (type === 'snippet') {
                    var index = $scope.snippets.indexOf(snippet);
                    $scope.snippets.splice(index, 1);
                    $http.delete('/api/delete_event_snippet/' + $stateParams.event + '/' + snippet._id);
                } else if (type === 'task') {
                    var index = $scope.tasks.indexOf(snippet);
                    $scope.tasks.splice(index, 1);
                    $http.delete('/api/delete_event_task/' + $stateParams.event + '/' + snippet._id);
                }
            };

            $scope.state = {
                audioDuration: 0,
                isPlaying: true, 
                currentSecond: 0,
                startSecond: 0,
                videoHeight: 850,
                autoHeight: true,
                length: 0,              // slide should and when is currentSecond + length
                chapterId: undefined,
                onLeftButtonPressed: undefined,
                onRightButtonPressed: undefined,
                onSaveFile: undefined,
                onOpenFile: undefined,
                activeChapterPercentage: 0
            };
            
            $scope.recordingPlayer = {
                //player
                //slide
            };
            
            var element = $('[class*="dm-xplatform-index-left"]').css('background-color', 'rgb(6,6,6)');


            var trainingId = $stateParams.id;

            $q.all([dmUser.getCurrentUser(), $http.get('/api/event_with_training/' + $stateParams.event)]).then(function (results) {
                $scope.user = results[0];
                $scope.snippets = results[1].data.snippets;
                $scope.tasks = results[1].data.tasks;
            });

            $scope.pointSelected = function (point) {
                $state.go('index.task', {
                    slide: point.slide,
                    event: point.event
                });
            };
            
            $scope.goToChapter = function (index) {
                $scope.state.isPlaying = false;
                $scope.state.currentSecond = 0;
                
                $timeout(function () {
                    $state.go('index.player.chapter', {index: index});
                }, 500);
            };

            
        }
    ]);
});

