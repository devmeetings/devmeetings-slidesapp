define(['angular', 'xplatform/xplatform-app',
  'xplatform/services/dm-events/dm-events',
  'xplatform/directives/dm-timeline/dm-timeline'
], function(angular, xplatformApp) {
  'use strict';

  xplatformApp.controller('dmXplatformTimeline', ['$scope', '$stateParams', 'dmEvents', '$window',
    function($scope, $stateParams, dmEvents, $window) {

      function fetchAnnotations() {
        dmEvents.getEventMaterial($stateParams.event, $stateParams.iteration, $stateParams.material).then(function(material) {
          $scope.audio = material.url;
          $scope.annotations = material.annotations;
        });
      }
      fetchAnnotations();
      $scope.$on('newAnnotations', fetchAnnotations);

      $scope.state = dmEvents.getState($stateParams.event, $stateParams.material);

      $scope.$on('$destroy', function() {
        // next time we will be here, just continue
        $scope.state.startSecond = $scope.state.currentSecond;
      });


      $scope.setTime = function(time) {
        $scope.setSecond = time;
      };
      $window.setTime = function(time) {
        $scope.$apply(function() {
          $scope.setSecond = time;
        });
      };

      $scope.withVoice = $stateParams.withVoice;


      var rates = [0.75, 1.0, 1.25, 1.5, 1.75, 2.0, 3.0, 4.0, 5.0, 10.0, 15.0, 20.0
      ];
      if ($scope.withVoice) {
        $scope.state.rate = rates[0];
      } else {
        $scope.state.rate = rates[rates.length - 3];
      }

      $scope.changeRate = function() {
        var nextRate = rates.indexOf($scope.state.rate) + 1;
        nextRate = nextRate % rates.length;
        $scope.nextRate = rates[(nextRate + 1) % rates.length];
        $scope.state.rate = rates[nextRate];
      };
      $scope.changeRate();

      $scope.keys.keyUp = function(event) {
        if (event.keyCode !== 32 || event.target.type === 'textarea') {
          return;
        }
        $scope.state.isPlaying = !$scope.state.isPlaying;
      };

      $scope.move = function(ev) {
        $scope.state.currentSecond = ev.offsetX / ev.target.clientWidth * $scope.state.max;
      };

    }
  ]);
});
