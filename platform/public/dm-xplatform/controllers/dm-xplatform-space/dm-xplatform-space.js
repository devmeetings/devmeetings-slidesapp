define(['angular', 'xplatform/xplatform-app', '_',
        'xplatform/services/dm-events/dm-events',
        'xplatform/controllers/dm-xplatform-upload/dm-xplatform-upload',
        'xplatform/services/dm-questions/dm-questions',
        'xplatform/directives/dm-chat/dm-chat'], function (angular, xplatformApp, _) {
    xplatformApp.controller('dmXplatformSpace', ['$scope', '$timeout', '$state', '$stateParams', '$http', '$modal', 'dmEvents', 'dmUser', 'dmQuestions', function ($scope, $timeout, $state, $stateParams, $http, $modal, dmEvents, dmUser, dmQuestions) {
        $scope.left = {
            min: '50px',
            max: '200px',
            current: '200px'
        };

        $scope.right = {
            min: '50px',
            max: '330px',
            current: '330px',
            opened: true
        };

        $scope.bottombarHeight = '0px';

        $scope.tabs = {};
        var aSpeed = 0.5;

        $scope.toggleRight = function (open) {
            var right = $scope.right;
            open = open === undefined ? !right.opened : open;
           
            if (open === right.opened) {
                return;
            }

            if (open) {

                $('.dm-spacesidebar-right #stream').fadeOut(500 * aSpeed);
                $('.dm-spacesidebar-right #issues').fadeOut(400 * aSpeed);
                $('.dm-spacesidebar-right #chat').fadeOut(300 * aSpeed);
                $('.dm-spacesidebar-right #docs').fadeOut(200 * aSpeed);
                
                $timeout(function () {

                    right.current = right.max;
                    $timeout(function () {
                        right.opened = open;
                        
                        $('.dm-spacesidebar-right .tab-content').fadeIn(600 * aSpeed);
                        $('.dm-spacesidebar-right #stream').fadeIn(200 * aSpeed);
                        $('.dm-spacesidebar-right #issues').fadeIn(300 * aSpeed);
                        $('.dm-spacesidebar-right #chat').fadeIn(400 * aSpeed);
                        $('.dm-spacesidebar-right #docs').fadeIn(500 * aSpeed);
                    }, 250 * aSpeed);

                }, 500 * aSpeed);

                return
            }

            $('.dm-spacesidebar-right #stream').fadeOut(500 * aSpeed);
            $('.dm-spacesidebar-right #issues').fadeOut(400 * aSpeed);
            $('.dm-spacesidebar-right #chat').fadeOut(300 * aSpeed);
            $('.dm-spacesidebar-right #docs').fadeOut(200 * aSpeed);

            $('.dm-spacesidebar-right .tab-content').fadeOut(600 * aSpeed, function () {
                $scope.$apply(function () {
                    right.opened = open;
                    right.current = right.min;
            
                    $timeout(function () {
                        $('.dm-spacesidebar-right #stream').fadeIn(200 * aSpeed);
                        $('.dm-spacesidebar-right #issues').fadeIn(300 * aSpeed);
                        $('.dm-spacesidebar-right #chat').fadeIn(400 * aSpeed);
                        $('.dm-spacesidebar-right #docs').fadeIn(500 * aSpeed);
                    }, 250 * aSpeed);
                });
            });
        };


        $scope.currentState = $state;
        $scope.$watch('currentState.current.name', function () {
            $scope.showTutorial = $state.current.name === 'index.space';
            $scope.bottombarHeight = $state.current.name === 'index.space.player' ? '25px' : '0px';
        });
        
        var isTaskDone = function (task) {
            var person = _.find($scope.event.ranking.people, function (p) {
                return p.user === $scope.currentUserId;
            });
            return person ? !!person.tasks[task._id] : false;
        };

        var markTasks = function (event) {
            event.iterations.forEach(function (i) {
                i.tasks.forEach(function (task) {
                    task.done = isTaskDone(task); 
                });
            });
        };

        dmEvents.getEvent($stateParams.event, true).then(function (data) {
            $scope.event = data;
            dmUser.getCurrentUser().then(function (data) { // Q All!
                $scope.currentUserId = data.result._id; 
                markTasks($scope.event);
            });
        }, function () {
        });

        $scope.openWorkspace = function () {
            $http.post('/api/base_slide/' + $scope.event.baseSlide).then(function (data) {
                $state.go('index.space.task', {
                    slide: data.data.slidesave
                });
            });
        };

        $scope.selectedAudio = function (audio) {
            var index =_.findIndex($scope.event.audios, function (elem) {
                return elem._id === audio;
            });
            $state.go('index.space.player', {
                index: index
            });
        };

        $scope.selectedTodo = function (todo) {
            $state.go('index.space.todo', {
                todo: todo
            });
        };

        $scope.markTaskAsDone = function (task, done) {
            dmEvents.eventTaskDone($scope.event._id, task._id, done);
        };

        $scope.createIteration = function () {
            dmEvents.createEventIteration($scope.event._id, {
                title: 'new iteration'
            });
        };

        $scope.removeIteration = function (iteration) {
            dmEvents.removeEventIteration($scope.event._id, iteration._id);
        };

        $scope.createMaterial = function (i) {
            var modalInstance = $modal.open({
                templateUrl: '/static/dm-xplatform/controllers/dm-xplatform-upload/index.html',
                controller: 'dmXplatformUpload',
                resolve: {
                    event: function () {
                        return $scope.event;
                    },
                    iteration: function () {
                        return i;           
                    }
                }
            });
        };

        $scope.askQuestion = function () {
            var modalInstance = $modal.open({
                templateUrl: '/static/dm-xplatform/controllers/dm-xplatform-question-create/index.html',
                controller: 'dmXplatformQuestionCreate',
                windowClass: 'dm-question-modal'
            });
        };

        dmQuestions.allQuestionsForEvent($stateParams.event, true);

    }]);
});

