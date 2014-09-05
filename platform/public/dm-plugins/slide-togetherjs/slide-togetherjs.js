define(['module', 'slider/slider.plugins'], function(module, sliderPlugins) {
    var path = sliderPlugins.extractPath(module);

    window.TogetherJSConfig_autoStart = false;
    window.TogetherJSConfig_siteName = 'XPlatform.org';
    window.TogetherJSConfig_toolName = 'Share!';
    window.TogetherJSConfig_suppressJoinConfirmation = true;
    window.TogetherJSConfig_suppressInvite = true;
    window.TogetherJSConfig_includeHashInUrl = true;
    window.TogetherJSConfig_disableWebRTC = true;
    window.TogetherJSConfig_cloneClicks = false;
    window.TogetherJSConfig_ignoreForms = true;
    window.TogetherJSConfig_ignoreMessages = true;

    sliderPlugins.registerPlugin('slide', 'togetherjs', 'slide-togetherjs', 10000).directive('slideTogetherjs', ['$window',

        function($window) {
            var together = 'togetherjs';

            return {
                restrict: 'E',
                scope: {
                    slide: '=context'
                },
                templateUrl: path + '/slide-togetherjs.html',
                link: function(scope) {
                    var selfUpdate = false;
                    var backUpdate = false;
                    scope.$watch('slide.workspace', function(workspace) {
                        if (!workspace || selfUpdate || backUpdate) {
                            selfUpdate = false;
                            backUpdate = false;
                            return;
                        }

                        selfUpdate = true;
                        if (window.TogetherJS) {
                            TogetherJS.send({
                                type: "workspace",
                                workspace: workspace
                            });
                        }
                    }, true);

                    // Load async
                    require([together], function() {
                        TogetherJS.hub.on('workspace', function(data) {
                            if (!data.sameUrl) {
                                return;
                            }

                            backUpdate = true;
                            scope.$apply(function() {
                                scope.slide.workspace = data.workspace;
                            });
                            sliderPlugins.trigger('slide.slide-workspace.update', data.workspace);
                        });
                        TogetherJS.reinitialize();
                    });
                }
            };
        }
    ]);
});