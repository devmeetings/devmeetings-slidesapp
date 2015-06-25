/* globals define */
define(['angular',
  '_',
  'dm-xplatform/xplatform-app',
  'directives/plugins-loader',
  'dm-xplatform/services/dm-slides/dm-slides'
], function (angular, _, xplatformApp, pluginsLoader) {
  xplatformApp.controller('dmXplatformDeckSlide',
    ['$scope', '$q', '$state', '$stateParams', 'dmSlides', 'dmBrowserTab',
      function ($scope, $q, $state, $stateParams, dmSlides, dmBrowserTab) {
        dmSlides.getSlide($stateParams.slide).then(function (slide) {
          $scope.slide = slide;
          dmBrowserTab.setTitleAndIcon(slide.data.content.name, 'slide');
        });
      }]);
});
