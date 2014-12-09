define(['_', 'angular', 'xplatform/xplatform-app',
    'xplatform/directives/dm-annotation/dm-annotation',
    'xplatform/directives/dm-microtask/dm-microtask',
    'xplatform/directives/dm-annotation-group/dm-annotation-group',
    './dm-xplatform-edit-annotation/dm-xplatform-edit-annotation'
], function(_, angular, xplatformApp) {


    function groupAnnotations(annos) {
        return annos.filter(function(x){
            // Don't group tasks
            return x.type !== 'task' && x.type !== 'comment';
        }).map(function(anno) {
            return {
                data: anno,
                categories: anno.title.split(/\s*:\s*/g)
            };
        }).reduce(function(memo, x){
            var currentCategory = x.categories.reduce(function(curr, category){
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
        }, {sub: {}});
    }

    xplatformApp.controller('dmXplatformAnnos', [
        '$scope', '$stateParams', '$state', '$modal', 'dmEvents', 'filterFilter', '$rootScope',
        function($scope, $stateParams, $state, $modal, dmEvents, $filter, $rootScope) {
            $scope.eventId = $stateParams.event;
            $scope.iterationId = $stateParams.iteration;
            $scope.materialId = $stateParams.material;

            var getSpecific = function() {
                dmEvents.getEventMaterial($stateParams.event, $stateParams.iteration, $stateParams.material).then(function(material) {
                    $scope.annotations = material.annotations;
                    $scope.sortedAnnotations = material.annotations.sort(function(a, b){
                      return a.timestamp - b.timestamp;
                    });
                });
            };

            var getAll = function() {
                dmEvents.getAllAnnotations($stateParams.event).then(function(annotations) {
                    dmEvents.getEvent($stateParams.event).then(function(event) {
                        var activeIterations = event.iterations.map(function(it, idx){
                            return {
                                idx: idx,
                                it: it
                            };
                        }).filter(function(x) {
                            return x.it.status === 'available';
                        });

                        var lastActive = activeIterations[activeIterations.length - 1] || {};
                        $scope.lastActiveIterationIdx = lastActive.idx;

                        if (!$rootScope.editMode) {
                            annotations = annotations.filter(function(x) {
                                return x.index <= $scope.lastActiveIterationIdx;
                            });
                        }
                        $scope.annotations = annotations;
                        $scope.groups = groupAnnotations(annotations);

                        $scope.$watch('search.text', function(){
                            var s = $scope.search.text;
                            $scope.groups = groupAnnotations($filter(annotations, s));
                        });
                    });
                });
            };


            $scope.showAll = $state.current.name !== 'index.space.player';
            if ($scope.showAll) {
                getAll();
            } else {
                getSpecific();
            }

            $scope.state = dmEvents.getState($stateParams.event, $stateParams.material);
            $scope.showSearch = true;
            $scope.search = {
                text: ''
            };

            $scope.newSnippet = {
            };
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
    ]);
});
