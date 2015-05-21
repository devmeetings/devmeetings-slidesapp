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
          setTimeout(function() {
            overlay(scope, function(clone) {
              element.append(clone);
            });
          }, timeout);
        };
      }
    };

  });

  xplatformApp.directive('dmIframeAutosize', function() {
    return {
      restrict: 'A',
      link: function(scope, element) {

        function fixSize() {
          if (!element[0].contentWindow) {
            return;
          }
          element[0].style.height = element[0].contentWindow.document.body.scrollHeight + 'px';
        }
        fixSize();

        element[0].addEventListener('load', fixSize);
        scope.$on('$destroy', function() {
          element[0].removeEventListener('load', fixSize);
        });
      }
    };
  });

  xplatformApp.directive('dmIframe', function($timeout) {
    return {
      restrict: 'A',
      link: function(scope, element, attr) {
        var timeout = attr.dmIframeTimeout || 700;
        var iframeLoading = attr.dmIframeLoading;

        var $parent = element.parent();

        function setLoading(val) {
          if (!iframeLoading) {
            return;
          }
          scope[iframeLoading] = val;
        }

        element.addClass('dm-iframe');

        function removeClass() {
          // Let the page render in background
          $timeout(function() {
            element.removeClass('dm-iframe-hidden');

            $timeout(function(){
              setLoading(false);
            }, 150);
          }, timeout);
        }

        // Setting iframe src is dealyed.
        attr.$observe('dmIframe', function(value) {
          element.addClass('dm-iframe-hidden');
          // Remove from DOM to prevent modyfing the history!
          element.detach();
          attr.$set('src', null);
          setLoading(true);

          $timeout(function() {
            attr.$set('src', value);
            $parent.append(element);
          }, timeout * 2);
        });

        element[0].addEventListener('load', removeClass);
        scope.$on('$destroy', function() {
          element[0].removeEventListener('load', removeClass);
        });
      }
    };
  });
});
