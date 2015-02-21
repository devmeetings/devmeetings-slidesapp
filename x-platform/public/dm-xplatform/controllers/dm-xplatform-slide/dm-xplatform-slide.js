define(['angular', 
        '_',
        'xplatform/xplatform-app',
        'directives/plugins-loader',
        'xplatform/services/dm-slidesaves/dm-slidesaves'
        ], function (angular, _, xplatformApp, pluginsLoader) {
    xplatformApp.controller('dmXplatformSlide', ['$scope', '$q', '$state', '$stateParams', 'dmSlidesaves', 'dmEvents', 'dmBrowserTab',
        function ($scope, $q, $state, $stateParams, dmSlidesaves, dmEvents, dmBrowserTab) {
//

        dmSlidesaves.saveWithId($stateParams.slide).then(function (save) {
            $scope.slide = save;
            dmBrowserTab.setTitleAndIcon(save.name, 'slide');
        });
        
         
        var sendWithDebounce = _.debounce(function (slide) {
            dmSlidesaves.getSaveType($state.params.slide).then(function (type) {
                if (type !== 'mine' && type !== 'other') {
                    dmSlidesaves.saveModified(slide);
                }
            });
        }, 200);

        $scope.state = dmEvents.getState($stateParams.event, 'save');

        $scope.$watch('slide', function () {
            if ($scope.slide) {
                sendWithDebounce($scope.slide); 
                $scope.state.save = $scope.slide;
            }
        }, true);
    }]);
});


