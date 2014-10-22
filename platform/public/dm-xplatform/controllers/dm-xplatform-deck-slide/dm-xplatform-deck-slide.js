define(['angular', 
        '_',
        'xplatform/xplatform-app',
        'directives/plugins-loader',
        'xplatform/services/dm-slides/dm-slides'
        ], function (angular, _, xplatformApp, pluginsLoader) {
    xplatformApp.controller('dmXplatformDeckSlide', ['$scope', '$q', '$state', '$stateParams', 'dmSlides', 
        function ($scope, $q, $state, $stateParams, dmSlides) {

        dmSlides.getSlide($stateParams.slide).then(function(slide) {
            $scope.slide = slide;
        });
    }]);
});


