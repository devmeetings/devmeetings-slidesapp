define(['angular', 'xplatform/xplatform-app', '_',
        'xplatform/services/dm-events/dm-events',
        'xplatform/directives/dm-spacesidebar/dm-spacesidebar'], function (angular, xplatformApp, _) {
    xplatformApp.controller('dmXplatformSpace', ['$scope', '$timeout', '$state', '$stateParams', '$http', 'dmEvents', 'dmUser', function ($scope, $timeout, $state, $stateParams, $http, dmEvents, dmUser) {
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
            return !!person.tasks[task._id];
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


    }]);
});

