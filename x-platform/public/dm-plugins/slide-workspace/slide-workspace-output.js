define(['module', '_', 'slider/slider.plugins'], function(module, _, sliderPlugins) {
  'use strict';

  var path = sliderPlugins.extractPath(module);

  var lastTimestamp = 0;
  var refreshOutput = _.throttle(function($rootScope, scope, contentUrl) {

    if (lastTimestamp > contentUrl.timestamp) {
      return;
    }
    lastTimestamp = contentUrl.timestamp;

    scope.$apply(function() {
      scope.isWaiting = false;
      scope.output.hash = contentUrl.hash;

      if ($rootScope.performance.indexOf('workspace_output_noauto') > -1) {
        return;
      }

      scope.contentUrl = contentUrl.hash;
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
            Sockets.emit('slide.slide-workspace.change', {
                timestamp: new Date().getTime(),
                workspace: workspace
            }, function(contentUrl) {
              refreshOutput($rootScope, scope, contentUrl);
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

          scope.updateContentUrl= function() {
            scope.contentUrl = scope.output.hash;
          };

          var swapFramesLater = _.throttle(function() {
            var oldFrame = currentFrame;

            function swapFrameNumbers(){
              currentFrame += 1;
              currentFrame = currentFrame % $iframes.length;
              if (scope.workspace.singleOutput || $rootScope.performance.indexOf('workspace_output_noanim') > -1) {
                currentFrame = 0;
              }
            }

            swapFrameNumbers();

            // Toggle classes
            var oldOutput = angular.element($iframes[currentFrame]);
            var newOutput = angular.element($iframes[oldFrame]);

            // Fix for old output lfashing.
            if (newOutput[0].src.indexOf(scope.contentUrl) === -1) {
              currentFrame = Math.max(0, currentFrame - 1);
              return;
            }

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
