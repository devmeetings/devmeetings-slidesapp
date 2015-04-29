define(['module', '_', 'slider/slider.plugins'], function(module, _, sliderPlugins) {
  'use strict';

  var path = sliderPlugins.extractPath(module);

  var lastTimestamp = 0;
  var refreshOutputNow = function($rootScope, scope, contentData, force) {

    if (lastTimestamp > contentData.timestamp) {
      return;
    }
    lastTimestamp = contentData.timestamp;

    scope.isWaiting = false;
    scope.output.hash = contentData.hash;
    scope.output.urlBase = contentData.url;

    if (!force && $rootScope.performance.indexOf('workspace_output_noauto') > -1) {
      scope.requiresRefresh = true;
      return;
    }
    doReloadOutput(scope);
  };

  function doReloadOutput(scope) {
    if (scope.slide.serverRunner === 'expressjs') {
      scope.isWaiting = true;
      sliderPlugins.trigger('slide.slide-workspace.run', scope.workspace, scope.path);
    } else {
      scope.requiresRefresh = false;
      var url = scope.workspace.url || '/';
      if (scope.output.urlBase) {
        scope.output.contentUrl = scope.output.urlBase + url;
      }
    }
  }

  function getTabsContent(t, w) {
    return t.map(function(x) {
      return w.tabs[x].content;
    });
  }

  function hasCodeChanged(w1, w2) {
    var t1 = Object.keys(w1.tabs);
    var t2 = Object.keys(w2.tabs);

    if (t1.length !== t2.length) {
      return true;
    }

    // Tab rename
    if (!_.isEqual(t1, t2)) {
      return true;
    }

    //Compare content
    var c1 = getTabsContent(t1, w1);
    var c2 = getTabsContent(t2, w2);

    if (!_.isEqual(c1, c2)) {
      return true;
    }

    return false;
  }

  function urlKeyPress(ev, scope) {
    if (ev.keyCode !== 13) {
      return;
    }
    scope.workspace.permaUrl = scope.workspace.url;
  }

  function listenToServerRunnerEvents(scope, $location, $rootScope, dmPlayer) {
    function updateUrls(result) {
      var port = result.port;
      scope.isWaiting = false;
      scope.requiresRefresh = false;
      scope.output.urlBase = 'http://' + $location.host() + ':' + port;
      var url = scope.workspace.url || '/';
      scope.output.contentUrl = scope.output.urlBase + url;
      scope.refreshIframe(scope.output.contentUrl);
    }

    sliderPlugins.listen(scope, 'slide.serverRunner.result', function(result) {
      if (!scope.isWaiting) {
        return;
      }

      if (lastTimestamp > result.timestamp) {
        return;
      }
      lastTimestamp = result.timestamp;

      updateUrls(result);

    });


    var lastWorkspace = {
      tabs: {}
    };

    sliderPlugins.listen(scope, 'slide.slide-workspace.change', function(workspace) {
      var needsRefresh = hasCodeChanged(lastWorkspace, workspace);
      if (!needsRefresh) {
        return;
      }
      lastWorkspace = JSON.parse(JSON.stringify(workspace));
      if ($rootScope.performance.indexOf('workspace_output_noauto') > -1) {
        scope.requiresRefresh = true;
      } else {
        doReloadOutput(scope);
      }
    });

    dmPlayer.onCurrentStateId(scope, function(stateId) {
      scope.output.hash = stateId;
    });
  }

  function listenToFrontendRunnerEvents(scope, Sockets, $rootScope, dmPlayer) {
    dmPlayer.onCurrentStateId(scope, function(stateId) {

      refreshOutputNow($rootScope, scope, {
        hash: stateId,
        url: '/api/page/' + stateId,
        timestamp: new Date().getTime()
      });

    });

    sliderPlugins.listen(scope, 'slide.slide-workspace.change', function() {
      scope.isWaiting = true;
    });
  }

  function handleIframes(scope, element, $timeout, $rootScope) {
    var currentFrame = 0;
    var $iframes;
    var isRendering = false;
    scope.refreshIframe = function(contentUrl) {
      $iframes = element.find('iframe');
      if (!contentUrl || contentUrl === 'waiting') {
        return;
      }

      if (scope.workspace.singleOutput) {
        currentFrame = 0;
      }

      // If we are already rendering display what we have
      if (isRendering) {
        swapFramesNow();
      }

      function updateFrames() {
        if (!$iframes[currentFrame]) {
          $iframes = element.find('iframe');
          $timeout(updateFrames, 60);
          return;
        }

        var src = $iframes[currentFrame].src;
        $iframes[currentFrame].src = contentUrl;
        if (src === contentUrl) {
          $iframes[currentFrame].src = '';
          setTimeout(function() {
            $iframes[currentFrame].src = contentUrl;
          }, 3);
        }
        // Swap frames on load
        angular.element($iframes[currentFrame]).one('load', function() {
          isRendering = false;
          swapFramesLater(currentFrame);
        });
      }
      isRendering = true;
      updateFrames();
    };

    var swapFramesNow = function(frameToDisplay) {
      var oldFrame = currentFrame;

      // We might be late with swapping.
      if (oldFrame !== frameToDisplay) {
        return;
      }

      function swapFrameNumbers() {
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
      if (newOutput[0].src.indexOf(scope.output.contentUrl) === -1) {
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
      }, 100);

    };
    var swapFramesLater = _.throttle(swapFramesNow, 500, {
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

  sliderPlugins.directive('slideWorkspaceOutput', [
    '$timeout', '$window', '$rootScope', '$location', 'Sockets', 'dmPlayer',
    function($timeout, $window, $rootScope, $location, Sockets, dmPlayer) {
      return {
        restrict: 'E',
        templateUrl: path + '/slide-workspace-output.html',
        link: function(scope, element) {

          scope.urlKeyPress = urlKeyPress;
          scope.isWaiting = true;

          if (scope.slide.serverRunner === 'expressjs') {
            listenToServerRunnerEvents(scope, $location, $rootScope, dmPlayer);
          } else {
            listenToFrontendRunnerEvents(scope, Sockets, $rootScope, dmPlayer);
          }

          handleIframes(scope, element, $timeout, $rootScope);

          scope.$watch('output.contentUrl', scope.refreshIframe);
          // when playing we need to have it also!
          scope.$watch('workspace.permaUrl', function() {
            doReloadOutput(scope);
          });

          scope.updateContentUrl = function() {
            doReloadOutput(scope);
          };

        }
      };
    }
  ]);

});
