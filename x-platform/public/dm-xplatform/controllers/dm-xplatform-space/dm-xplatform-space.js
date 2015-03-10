define(['angular', 'xplatform/xplatform-app', '_',
  'xplatform/services/dm-events/dm-events',
  'xplatform/controllers/dm-xplatform-upload/dm-xplatform-upload',
  'xplatform/services/dm-questions/dm-questions',
  'xplatform/directives/dm-iframe/dm-iframe',
  'xplatform/directives/dm-xplatform-performance/dm-xplatform-performance',
  'xplatform/filters/liveLinkUrl',
], function(angular, xplatformApp, _) {
  xplatformApp.controller('dmXplatformSpace', ['$scope', '$rootScope', '$timeout', '$state', '$stateParams', '$location', '$http', '$modal', 'dmEvents', 'dmUser', 'dmQuestions', 'dmSlidesaves', 'Fullscreen', 'dmBrowserTab',
    function($scope, $rootScope, $timeout, $state, $stateParams, $location, $http, $modal, dmEvents, dmUser, dmQuestions, dmSlidesaves, Fullscreen, dmBrowserTab) {

      $scope.changeFullScreen = function(enable) {
         if (!enable) {
          Fullscreen.cancel();
         } else {
          Fullscreen.all();
         }
      };
      var removeFullscreenHandler = Fullscreen.$on('FBFullscreen.change', function(){
        $rootScope.$apply(function(){
          $rootScope.isZenMode = Fullscreen.isEnabled();
        });
      });
      $scope.$on('$destroy', removeFullscreenHandler);

      $scope.left = {
        min: '0px',
        max: '0px',
        current: '0px'
      };

      $scope.right = {
        min: '35px',
        max: '330px',
        current: '35px',
        opened: false
      };

      $scope.bottombarHeight = '0px';

      $scope.keys = {};
      $scope.tabs = {};
      var aSpeed = 0.2;

      $scope.togglePinRight = function() {
        var right = $scope.right;

        if (!right.defaultMin) {
          right.defaultMin = right.min;
        }
      
        if (right.pinned) {
          right.min = right.defaultMin;
        } else {
          right.min = right.max;
        }
        right.pinned = !right.pinned;
      };

      $scope.toggleRight = function(open, force) {
        if ($scope.editMode && !force) {
          return;
        }

        var right = $scope.right;
        open = open === undefined ? !right.opened : open;

        if (open === right.opened) {
          return;
        }

        if (open) {

          $timeout(function() {

            right.current = right.max;
            $timeout(function() {
              right.opened = open;

              $('.dm-spacesidebar-right .tab-content').fadeIn(600 * aSpeed);
            }, 250 * aSpeed);

          }, 500 * aSpeed);

          return;
        }

        $('.dm-spacesidebar-right .tab-content').hide();

        right.opened = open;
        right.current = right.min;
      };

      $timeout(function(){
        $scope.toggleRight(false);
      }, 2000);

      if ($scope.editMode) {
        $scope.right.min = $scope.right.max;
        $scope.toggleRight(true, true);
      }



      $scope.currentLocation = $location;
      $scope.$watch('currentLocation.$$absUrl', function() {
        $scope.activeIteration = $state.params.iteration;
        $scope.showTutorial = $state.current.name === 'index.space';
        $scope.bottombarHeight = $state.current.name === 'index.space.player' ? '25px' : '0px';
        if ($state.current.name === 'index.space.task') {
          dmSlidesaves.getSaveType($state.params.slide, true).then(function(type) {
            $scope.warningType = type;
          });
        } else {
          $scope.warningType = undefined;
        }
      });

      var isTaskDone = function(task) {
        var person = _.find($scope.event.ranking.people, function(p) {
          return p.user === $scope.currentUserId;
        });
        return person ? !!person.tasks[task._id] : false;
      };

      var markTasks = function(event) {
        event.iterations.forEach(function(i) {
          i.tasks.forEach(function(task) {
            task.done = isTaskDone(task);
          });
        });
      };

      dmUser.getCurrentUser().then(function(data) {
        $scope.user = data;
      });

      dmBrowserTab.setTitleAndIcon('xPlatform');

      dmEvents.getEvent($stateParams.event, true).then(function(data) {
        $scope.event = data;
        dmBrowserTab.setTitleAndIcon(data.title);
        dmUser.getCurrentUser().then(function(data) { // Q All!
          $scope.currentUserId = data.result._id;
          markTasks($scope.event);
        });


        // Fetch current workspace
        $http.post('/api/events/' + $scope.event._id + '/base_slide/' + $scope.event.baseSlide).then(function(data) {
          $scope.workspaceId = data.data.slidesave;
          dmSlidesaves.refresh();
        });
      }, function() {});


      $scope.openWorkspace = function() {
        $http.post('/api/events/' + $scope.event._id + '/base_slide/' + $scope.event.baseSlide).then(function(data) {
          dmSlidesaves.allSaves(true); // ugly! update saves list, TODO ugly
          $state.go('index.space.task', {
            slide: data.data.slidesave
          });
          $scope.workspaceId = data.data.slidesave;
        });
      };

      $scope.selectedAudio = function(audio) {
        var index = _.findIndex($scope.event.audios, function(elem) {
          return elem._id === audio;
        });
        $state.go('index.space.player', {
          index: index
        });
      };

      $scope.selectedTodo = function(todo) {
        $state.go('index.space.todo', {
          todo: todo
        });
      };

      $scope.createMaterial = function(i) {
        var modalInstance = $modal.open({
          templateUrl: '/static/dm-xplatform/controllers/dm-xplatform-upload/index.html',
          controller: 'dmXplatformUpload',
          resolve: {
            event: function() {
              return $scope.event;
            },
            iteration: function() {
              return i;
            }
          }
        });
      };

      dmQuestions.allQuestionsForEvent($stateParams.event, true);
      dmSlidesaves.allSaves(true);

    }
  ]);
});
