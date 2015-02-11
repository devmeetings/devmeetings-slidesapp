define(['module', '_', 'slider/slider.plugins'], function(module, _, sliderPlugins) {
  'use strict';

  var path = sliderPlugins.extractPath(module);

  var refreshOutput = _.throttle(function(scope, contentUrl) {
    scope.$apply(function() {
      scope.isWaiting = false;

      scope.contentUrl = contentUrl.hash;
      scope.output.hash = scope.contentUrl;
    });
  }, 800, {
    trailing: true,
    leading: false
  });



  sliderPlugins.directive('slideWorkspaceOutput', [
    '$timeout', '$window', '$rootScope', 'Sockets',
    function($timeout, $window, $rootScope, Sockets) {
      return {
        restrict: 'E',
        templateUrl: path + '/slide-workspace-output.html',
        link: function(scope, element) {

          sliderPlugins.listen(scope, 'slide.slide-workspace.change', function(workspace) {
            scope.isWaiting = true;
            Sockets.emit('slide.slide-workspace.change', workspace, function(contentUrl) {
              refreshOutput(scope, contentUrl);
            });
          });

          var currentFrame = 0;
          var $iframes = element.find('iframe');
          scope.$watch('contentUrl', function(hash) {
            if (!hash || hash === 'waiting') {
              return;
            }
            if (scope.workspace.singleOutput) {
              currentFrame = 0;
            }
            $iframes[currentFrame].src = '/api/page/' + hash + "/";
            // Swap frames on load
            angular.element($iframes[currentFrame]).one('load', swapFramesLater);
          });

          var swapFramesLater = _.throttle(function() {
            var oldFrame = currentFrame;
            currentFrame += 1;
            currentFrame = currentFrame % $iframes.length;
            if (scope.workspace.singleOutput || $rootScope.performance.indexOf('workspace_output_anim') > -1) {
              currentFrame = 0;
            }

            // Toggle classes
            var oldOutput = angular.element($iframes[currentFrame]);
            var newOutput = angular.element($iframes[oldFrame]);

            oldOutput.addClass('fadeOut');
            newOutput.removeClass('fadeOut hidden');

            // When fadeout finishes
            $timeout(function() {
              oldOutput.addClass('onBottom hidden');
              newOutput.removeClass('onBottom');

              if (oldFrame === currentFrame) {
                newOutput.removeClass('fadeOut hidden');
              }
            }, 250);

          }, 700, {
            leading: false,
            trailing: true
          });

          angular.forEach($iframes, function(frame) {
            var $iframe = angular.element(frame);
            $iframe.on('load', _.debounce(function() {
              try {
                var contentWindow = $iframe[0].contentWindow;
                sliderPlugins.trigger('slide.fiddle.output', contentWindow.document, contentWindow);
              } catch (e) {
                // Just swallow exceptions about CORS
              }
            }, 500));
          });
        }
      };
    }
  ]);

});
