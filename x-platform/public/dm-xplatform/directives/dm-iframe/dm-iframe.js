define(['angular', 'xplatform/xplatform-app'], function(angular, xplatformApp) {
  'use strict';

  xplatformApp.directive('dmIframe', function($timeout) {
    return {
      restrict: 'A',
      link: function(scope, element, attr) {
        element.addClass('dm-iframe');

        function removeClass() {
          // Let the page render in background
          $timeout(function(){
            element.removeClass('dm-iframe-hidden');
          }, 1000);
        }

        // Setting iframe src is dealyed.
        attr.$observe('dmIframe', function(value) {
          element.addClass('dm-iframe-hidden');
          attr.$set('src', null);

          $timeout(function() {
            attr.$set('src', value);
          }, 5000);
        });

        element[0].addEventListener('load', removeClass);
        scope.$on('$destroy', function() {
          element[0].removeEventListener('load', removeClass);
        });
      }
    };
  });
});
