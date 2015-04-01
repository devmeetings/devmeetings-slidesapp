define(['angular', 'xplatform/xplatform-app'], function(angular, xplatformApp) {
  'use strict';

  xplatformApp.directive('dmDefer', function($compile) {
    
    return {
      restrict: 'A',
      compile: function(tElement, tAttrs) {
        var el = tElement.children().remove();
        var overlay = $compile(el);
        var timeout = tAttrs.dmDefer || 1000;
        timeout = timeout - 250 + Math.random() * 250;

        return function link(scope, element) {
          setTimeout(function(){
            overlay(scope, function(clone) { 
              element.append(clone);
            });
          }, timeout);
        };
      }
    };
  
  });

  xplatformApp.directive('dmIframe', function($timeout) {
    return {
      restrict: 'A',
      link: function(scope, element, attr) {
        element.addClass('dm-iframe');

        function removeClass() {
          // Let the page render in background
          $timeout(function(){
            element.removeClass('dm-iframe-hidden');
          }, 700);
        }

        // Setting iframe src is dealyed.
        attr.$observe('dmIframe', function(value) {
          element.addClass('dm-iframe-hidden');
          attr.$set('src', null);

          $timeout(function() {
            attr.$set('src', value);
          }, 1500);
        });

        element[0].addEventListener('load', removeClass);
        scope.$on('$destroy', function() {
          element[0].removeEventListener('load', removeClass);
        });
      }
    };
  });
});
