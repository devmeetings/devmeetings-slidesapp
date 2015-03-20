define(['module', '_', 'slider/slider.plugins'], function(module, _, sliderPlugins) {
  'use strict';

  var path = sliderPlugins.extractPath(module);

  var lastTimestamp = 0;
  var refreshOutput = _.throttle(function($rootScope, scope, contentData, force) {

    if (lastTimestamp > contentData.timestamp) {
      return;
    }
    lastTimestamp = contentData.timestamp;

    scope.$apply(function() {
      scope.isWaiting = false;
      scope.output.hash = contentData.hash;
      scope.output.newUrl = contentData.url;

      if (!force && $rootScope.performance.indexOf('workspace_output_noauto') > -1) {
        scope.requiresRefresh = true;
        return;
      }
      doReloadOutput(scope);
    });
  }, 800, {
    trailing: true,
    leading: false
  });

  function doReloadOutput(scope) {
      if( scope.slide.serverRunner === 'expressjs') {
        sliderPlugins.trigger('slide.slide-workspace.run', scope.workspace);
      } else {
        scope.requiresRefresh = false;
        scope.contentUrl = scope.output.newUrl;
      }
  }

  sliderPlugins.directive('slideWorkspaceOutput', [
    '$timeout', '$window', '$rootScope', '$location', 'Sockets',
    function($timeout, $window, $rootScope, $location, Sockets) {
      return {
        restrict: 'E',
        templateUrl: path + '/slide-workspace-output.html',
        link: function(scope, element) {

          if (scope.slide.serverRunner === 'expressjs') {

            sliderPlugins.listen(scope, 'slide.serverRunner.result', function(result) {
              var port = result.port;
              scope.requiresRefresh = false;
              scope.output.newUrl = '//' + $location.host() + ':' + port;
              scope.contentUrl = scope.output.newUrl;
              scope.refreshIframe(scope.contentUrl);
            });

            sliderPlugins.listen(scope, 'slide.slide-workspace.change', function(workspace) {
              if ($rootScope.performance.indexOf('workspace_output_noauto') > -1) {
                scope.requiresRefresh = true;
              } else {
                doReloadOutput(scope);
              }
            });
          } else {
            sliderPlugins.listen(scope, 'slide.slide-workspace.change', function(workspace) {
              scope.isWaiting = true;
              Sockets.emit('slide.slide-workspace.change', {
                  timestamp: new Date().getTime(),
                  workspace: workspace
              }, function(contentData) {
                contentData.url = '/api/page/' + contentData.hash + '/';
                refreshOutput($rootScope, scope, contentData);
              });
            });
          }

          var currentFrame = 0;
          var $iframes = element.find('iframe');
          scope.refreshIframe = function(contentUrl) {
            if (!contentUrl || contentUrl === 'waiting') {
              return;
            }

            if (scope.workspace.singleOutput) {
              currentFrame = 0;
            }
            
            var src = $iframes[currentFrame].src;
            $iframes[currentFrame].src = contentUrl;
            if (src === contentUrl) {
              $iframes[currentFrame].contentWindow.location.reload(true);
            }
            // Swap frames on load
            angular.element($iframes[currentFrame]).one('load', swapFramesLater);
          };
          scope.$watch('contentUrl', scope.refreshIframe);

          scope.updateContentUrl= function() {
            doReloadOutput(scope);
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
