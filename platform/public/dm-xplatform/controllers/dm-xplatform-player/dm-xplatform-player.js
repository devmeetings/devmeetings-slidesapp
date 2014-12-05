define(['angular', 'xplatform/xplatform-app', '_',
    'xplatform/services/dm-events/dm-events',
    'xplatform/services/dm-recordings/dm-recordings',
    'services/RecordingsPlayerFactory'
], function(angular, xplatformApp, _) {
    xplatformApp.controller('dmXplatformPlayer', ['$scope', '$stateParams', '$timeout', 'dmEvents', 'dmRecordings', 'RecordingsPlayerFactory',
        function($scope, $stateParams, $timeout, dmEvents, dmRecordings, RecordingsPlayerFactory) {

            dmEvents.getEvent($stateParams.event, false).then(function(data) {
                var material = _.find(data.iterations[$stateParams.iteration].materials, function(elem) {
                    return elem._id === $stateParams.material;
                });
                return dmRecordings.getRecording(material.material);
            }).then(function(recording) {
                $scope.recordingPlayer = RecordingsPlayerFactory(recording, function(slide) {
                    $scope.slide = slide;
                });
                goToSecond();
            });

            $scope.runNext = function() {
              $scope.starting = true;
              $timeout(function(){
                $scope.state.isPlaying = true;
                $scope.starting = false;
              }, 1000);
            };


            $scope.nextStop = 0.1;

            var goToSecond = _.throttle(function(curr, prev) {
                if (!$scope.recordingPlayer) {
                    return;
                }
                var second = $scope.state.currentSecond;

                $scope.recordingPlayer.goToSecond(second);


                if (second > $scope.nextStop) {
                    $scope.anno = $scope.next;

                    var anno = _.find($scope.annotations, function(anno) {
                        return anno.timestamp > second;
                    });
                    if (anno) {
                        $scope.nextStop = anno.timestamp;
                        $scope.next = anno;
                    } else {
                      $scope.nextStop = 100000;
                    }

                    $scope.state.isPlaying = false;

                    // TODO [ToDr] Fix me please :(
                    // Changing position of subtitles
                    var myself = $('.dm-player-subtitles');
                    
                    setTimeout(function() {
                      var rect = $('.ace_cursor')[0].getBoundingClientRect();
                      var positionTop = Math.max(20, rect.top - (myself.height() - 40)/ 2);

                      myself.css({
                        left: "calc(45% + " + (rect.left/50) + 'px)',
                        top: positionTop + 'px'
                      });
                    }, 450);
                } else {
                  // fix nextStop when we are going backwards or fast forward

                  var anno = _.find($scope.annotations, function(anno) {
                    return anno.timestamp > curr && anno.timestamp < prev;
                  });
                  if (anno) {
                    $scope.nextStop = anno.timestamp;
                    $scope.next = anno;

                    var curIdx = $scope.annotations.indexOf(anno);
                    if (curIdx > 0) {
                      $scope.anno = $scope.annotations[curIdx];
                    }
                  } else {
                      $scope.nextStop = 100000;
                  }
                }
            }, 3);

            $scope.state = dmEvents.getState($stateParams.event, $stateParams.material);

            $scope.$watch('state.currentSecond', goToSecond);
            
            function fetchAnnotations(){
              dmEvents.getEventMaterial($stateParams.event, $stateParams.iteration, $stateParams.material).then(function(material) {
                  $scope.annotations = material.annotations.sort(function(a, b) {
                      return a.timestamp - b.timestamp;
                  });
              });
            }

            fetchAnnotations();
            $scope.$on('newAnnotations',  fetchAnnotations);

        }
    ]);
});
