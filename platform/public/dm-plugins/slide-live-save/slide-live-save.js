define(['module', '_', 'slider/slider.plugins', 'services/SlideLiveSave'], function(module, _, sliderPlugins, SlideLiveSave) {
    var path = sliderPlugins.extractPath(module);

    var THROTTLE_SAVING = 1000;

    sliderPlugins.registerPlugin('slide.toolbar', 'live-save', 'slide-live-save', 5000).directive('slideLiveSave', [
        'SlideLiveSave', 'localStorageService',
        function(SlideLiveSave, localStorageService) {
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
                    scope.$watch('recording', function(newVal) {
                        if (newVal !== undefined) {
                            localStorageService.set('dev.recording', newVal);
                            updateSlide(scope.slide);
                        }
                    });
                }
            };
        }
    ]);

});