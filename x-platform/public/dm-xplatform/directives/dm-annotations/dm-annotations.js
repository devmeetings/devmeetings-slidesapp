define([
  '_', 'angular', 'dm-xplatform/xplatform-app',
  'dm-xplatform/directives/dm-annotation/dm-annotation',
  'dm-xplatform/directives/dm-microtask/dm-microtask',
  'dm-xplatform/directives/dm-annotation-group/dm-annotation-group',
  'dm-xplatform/directives/dm-annotations/dm-annotation-edit/dm-annotation-edit'
], function(_, angular, xplatformApp) {
  'use strict';

  function groupAnnotations(annos) {
    return annos.filter(function(x) {
      // Don't group tasks
      return x.type !== 'task' && x.type !== 'comment';
    }).map(function(anno) {
      return {
        data: anno,
        categories: anno.title.split(/\s*:\s*/g)
      };
    }).reduce(function(memo, x) {
      var currentCategory = x.categories.reduce(function(curr, category) {
        if (!curr.sub[category]) {
          curr.sub[category] = {
            name: category,
            sub: {},
            annos: []
          };
        }
        return curr.sub[category];
      }, memo);

      currentCategory.annos.push(x.data);
      return memo;
    }, {
      sub: {}
    });
  }


  xplatformApp.directive('dmAnnotations', function($timeout, dmEvents, filterFilter) {

    var $filter = filterFilter;

    return {
      restrict: 'E',
      replace: true,
      scope: {
        eventId: '=',
        iterationId: '=',
        materialId: '=',
        showAll: '='
      },
      templateUrl: '/static/dm-xplatform/directives/dm-annotations/dm-annotations.html',
      link: function($scope) {

        var getSpecific = function() {
          dmEvents.getEventAnnotations($scope.eventId, $scope.iterationId, $scope.materialId).then(function(annos) {
            $scope.annotations = annos;
            $scope.sortedAnnotations = annos.sort(function(a, b) {
              return a.timestamp - b.timestamp;
            });
          });
        };

        var getAll = function() {
          dmEvents.getAllAnnotations($scope.eventId).then(function(annotations) {
            $scope.annotations = annotations;

            $scope.$watch('search.text', function() {
              var s = $scope.search.text;
              $scope.groups = groupAnnotations($filter(annotations, s));
            });
          });
        };


        if ($scope.showAll) {
          getAll();
        } else {
          getSpecific();
        }

        $scope.state = dmEvents.getState($scope.eventId, $scope.materialId);
        $scope.showSearch = $scope.showAll;
        $scope.search = {
          text: ''
        };

        $scope.newSnippet = {};
        $scope.$watch('state.currentSecond', function(val) {
          $scope.newSnippet.timestamp = val;
        });

        if ($scope.editMode) {
          $scope.$watch('state.currentSecond', function(val) {
            if (!$scope.annotations) {
              return;
            }
            var anno = _.find($scope.sortedAnnotations, function(anno) {
              return anno.timestamp > val;
            });
            var idx = $scope.sortedAnnotations.indexOf(anno);
            if (idx > 0) {
              $scope.currentAnno = $scope.sortedAnnotations[idx - 1];
            }
          });
        }
      }
    };
  });
});
