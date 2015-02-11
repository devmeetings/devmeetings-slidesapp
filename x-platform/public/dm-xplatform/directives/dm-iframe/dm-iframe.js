define(['angular', 'xplatform/xplatform-app'], function(angular, xplatformApp) {
  'use strict';

  xplatformApp.directive('dmIframe', [function() {
    return {
      restrict: 'A',
      link: function(scope, element) {
        element.addClass('dm-iframe');
        element.addClass('dm-iframe-hidden');

        function removeClass() {
          element.removeClass('dm-iframe-hidden');
        }
        element[0].addEventListener('load', removeClass);
        scope.$on('$destroy', function() {
          element[0].removeEventListener('load', removeClass);
        });
      }
    };
  }]);
});
