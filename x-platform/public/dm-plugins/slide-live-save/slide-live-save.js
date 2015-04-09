define(['module', '_', 'angular', 'howler', 'slider/slider.plugins', 'services/SlideLiveSave'], function(module, _, angular, howler, sliderPlugins, SlideLiveSave) {
    var path = sliderPlugins.extractPath(module);

    var THROTTLE_SAVING = 300;

    sliderPlugins.registerPlugin('slide', 'live-save', 'slide-live-save', 50000).directive('slideLiveSave', [
        'SlideLiveSave', 'localStorageService', '$timeout',
        function(SlideLiveSave, localStorageService, $timeout) {
            return {
                restrict: 'E',
                scope: {
                    data: '=data',
                    slide: '=context'
                },
                templateUrl: path + '/slide-live-save.html',
                link: function(scope, element) {
                    scope.recording = localStorageService.get('dev.recording') === 'true';

                    var updateSlide = _.throttle(function(newSlide) {
                        if (scope.recording) {
                            SlideLiveSave.save(newSlide);
                        }
                    }, THROTTLE_SAVING, {
                        leading: true,
                        trailing: false
                    });

                    scope.$watch('slide', updateSlide, true);
                    sliderPlugins.listen(scope, 'slide.save', function() {
                        if (scope.recording) {
                            SlideLiveSave.save(scope.slide);
                        }
                    });

                    scope.$watch('recording', function(newVal) {
                        if (newVal !== undefined) {
                            localStorageService.set('dev.recording', newVal);
                            updateSlide(scope.slide);
                        }
                    });

                    var sound = new howler.Howl({
                        urls: [path + '/firetruck-short.wav']
                    });


                    // Start rec button
                    scope.maxWaitTime = 5000;
                    scope.startingRecording = function() {
                        scope.waitTime = 0;
                        scope.recording = true;

                        var currentSlide = angular.copy(scope.slide);
                        var startTime = new Date();
                        var endTime = new Date(startTime.getTime() + scope.maxWaitTime);

                        scope.waiting = startTime;
                        currentSlide.recordingStarted = startTime;
                        SlideLiveSave.save(currentSlide);
                        sound.play();

                        function updateTime(force) {
                            if (scope.waiting !== startTime) {
                                return;
                            }

                            var curTime = new Date().getTime();
                            scope.waitTime = curTime - startTime.getTime();

                            if (curTime < endTime.getTime()) {
                                $timeout(updateTime, 5);
                            } else {
                                scope.waiting = false;
                                scope.waitTime = 0;
                            }
                        }
                        updateTime(true);
                    };

                }
            };
        }
    ]);

});
