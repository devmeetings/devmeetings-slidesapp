define(['module', 'slider/slider.plugins', 'togetherjs'], function(module, sliderPlugins, togetherjs) {
    var path = sliderPlugins.extractPath(module);

    var TogetherJS = window.TogetherJS;

    TogetherJS.config('siteName', 'XPlatform.org');
    TogetherJS.config('toolName', 'Share!');
    TogetherJS.config('suppressJoinConfirmation', true);
    TogetherJS.config('suppressInvite', true);
    TogetherJS.config('includeHashInUrl', true);
    TogetherJS.config('disableWebRTC', true);
    TogetherJS.config('cloneClicks', false);
    TogetherJS.config('ignoreForms', true);
    TogetherJS.config('ignoreMessages', true);

    sliderPlugins.registerPlugin('slide', 'togetherjs', 'slide-togetherjs', 10000).directive('slideTogetherjs', ['$window',

        function($window) {

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
                        TogetherJS.send({
                            type: "workspace",
                            workspace: workspace
                        });
                    }, true);

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
                }
            };
        }
    ]);
});