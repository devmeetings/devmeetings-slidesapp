define(['module', 'slider/slider.plugins', 'services/SlideLiveSave'], function(module, sliderPlugins, SlideLiveSave) {
    var path = sliderPlugins.extractPath(module);

    sliderPlugins.registerPlugin('slide', 'live-save', 'slide-live-save', 5000).directive('slideLiveSave', [
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
                    scope.$watch('slide', function(newSlide, oldSlide) {

                        // if button
                        if (scope.recording) {
                            SlideLiveSave.save(newSlide);
                        }
                    }, true);
                    scope.$watch('recording', function(newVal) {
                        if (newVal !== undefined) {
                            localStorageService.set('dev.recording', newVal);
                        }
                    });
                }
            };
        }
    ]);

});