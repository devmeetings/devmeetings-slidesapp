define(['module', 'slider/slider.plugins', 'services/SlideLiveSave'], function(module, sliderPlugins, SlideLiveSave) {
    var path = sliderPlugins.extractPath(module);

    sliderPlugins.registerPlugin('slide', 'live-save', 'slide-live-save' ).directive('slideLiveSave', [ 
        'SlideLiveSave',
        function(SlideLiveSave) {
            return {
                restrict: 'E',
                scope: {
                    data: '=data',
                    slide: '=context'
                },
                templateUrl: path + '/slide-live-save.html',
                link: function (scope, element) {
                    scope.$watch ('slide', function (newSlide, oldSlide) {

                        // if button
                        if (scope.recording) {
                            SlideLiveSave.save(newSlide);
                        }
                    }, true);
                }
            };
        }
    ]);

});

