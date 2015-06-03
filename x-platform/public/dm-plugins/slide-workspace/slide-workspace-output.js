define(['module', '_', 'angular', 'slider/slider.plugins'], function(module, _, angular, sliderPlugins) {
  'use strict';

  var path = sliderPlugins.extractPath(module);

  var lastTimestamp = 0;
  var refreshOutputNow = function($timeout, $rootScope, scope, contentData, force) {

    if (lastTimestamp > contentData.timestamp) {
      return;
    }
    lastTimestamp = contentData.timestamp;

    scope.output.hash = contentData.hash;
    scope.output.urlBase = contentData.url;

    if (!force && $rootScope.performance.indexOf('workspace_output_noauto') > -1) {
      scope.requiresRefresh = true;
      scope.isWaiting = false;
      return;
    }

    doReloadOutput(scope);
  };

  var refreshOutputLater = _.throttle(function($timeout, $rootScope, scope, contentData, force) {

    $timeout(function() {
      refreshOutputNow($timeout, $rootScope, scope, contentData, force);
    }, 50);

  }, 2500);

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

  function listenToServerRunnerEvents(scope, $location, $rootScope, dmPlayer) {
    function updateUrls(result) {
      var port = result.port;
      var host = result.url || $location.host();

      scope.isWaiting = false;
      scope.isDead = result.isDead;
      scope.requiresRefresh = false;
      scope.output.urlBase = 'http://' + host + ':' + port;

      dmPlayer.getCurrentStateId().then(function(stateId) {
        // This is needed for downloading code.
        scope.output.hash = stateId;
      });

      if (result.isDead) {
        return;
      }
      refreshUrl();
    }

    function refreshUrl() {
      var out = scope.output;
      if (!out.urlBase) {
        return;
      }

      var url = scope.workspace.url || '/';
      out.contentUrl = out.urlBase + url;

      scope.refreshIframe(out.contentUrl);
    }

    // when playing we need to have it also!
    scope.$watch('workspace.permaUrl', function() {
      refreshUrl();
    });

    sliderPlugins.listen(scope, 'slide.serverRunner.result', function(result) {
      if (lastTimestamp > result.timestamp) {
        return;
      }

      // We want to know when server is up again.
      if (!scope.isWaiting && scope.isDead === result.isDead) {
        return;
      }

      lastTimestamp = result.timestamp;

      scope.$apply(function() {
        updateUrls(result);
      });
    });


    var lastWorkspace = {
      tabs: {}
    };

    function reloadIfNeeded() {
      if ($rootScope.performance.indexOf('workspace_output_noauto') > -1) {
        scope.requiresRefresh = true;
      } else {
        doReloadOutput(scope);
      }
    }

    sliderPlugins.listen(scope, 'slide.slide-workspace.change', function(workspace) {
      var needsRefresh = hasCodeChanged(lastWorkspace, workspace);
      if (!needsRefresh) {
        return;
      }
      lastWorkspace = JSON.parse(JSON.stringify(workspace));
      reloadIfNeeded();
    });

    // Trigger initial reload
    reloadIfNeeded();
  }

  function listenToFrontendRunnerEvents($timeout, scope, Sockets, $rootScope, dmPlayer) {

    // [ToDr] Handling race conditions?
    var latestStateId;

    function render() {
      refreshOutputLater($timeout, $rootScope, scope, {
        hash: latestStateId,
        url: '/api/page/' + latestStateId,
        timestamp: new Date().getTime()
      });
    }

    // When switching sources in dmPlayer we are not listening to right thing!!!!!
    dmPlayer.onCurrentStateId(scope, function(stateId) {
      latestStateId = stateId;

      dmPlayer.getCurrentStateId().then(render);
    });

    sliderPlugins.listen(scope, 'slide.slide-workspace.change', function() {
      scope.isWaiting = true;
      scope.isDead = false;

      dmPlayer.getCurrentStateId().then(render);
    });

    // when playing we need to have it also!
    scope.$watch('workspace.permaUrl', function() {
      doReloadOutput(scope);
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
        var done = false;
        var actualFrame = currentFrame;

        function finishRenderingAndSwapFrame() {
          if (done) {
            return;
          }
          done = true;
          isRendering = false;
          swapFramesLater(actualFrame);
        }

        angular.element($iframes[actualFrame]).one('load', finishRenderingAndSwapFrame);

        // Timeout for loading of iframe
        setTimeout(finishRenderingAndSwapFrame, 700);
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

        scope.isWaiting = false;

        if (oldFrame === currentFrame) {
          newOutput.removeClass('fadeOut hidden');
        }
      }, 70);

    };
    var swapFramesLater = _.throttle(swapFramesNow, 50);

    angular.forEach($iframes, function(frame) {
      var $iframe = angular.element(frame);
      $iframe.on('load', _.debounce(function() {
        try {
          var contentWindow = $iframe[0].contentWindow;
          sliderPlugins.trigger('slide.fiddle.output', contentWindow.document, contentWindow);
        } catch (e) {
          // Just swallow exceptions about CORS
        }
      }, 300));
    });
  }

  function urlKeyPress(ev, scope) {
    if (ev.keyCode !== 13) {
      return;
    }
    scope.workspace.permaUrl = scope.workspace.url;
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
            listenToFrontendRunnerEvents($timeout, scope, Sockets, $rootScope, dmPlayer);
          }

          handleIframes(scope, element, $timeout, $rootScope);

          scope.$watch('output.contentUrl', scope.refreshIframe);

          scope.updateContentUrl = function() {
            doReloadOutput(scope);
          };

        }
      };
    }
  ]);

});
