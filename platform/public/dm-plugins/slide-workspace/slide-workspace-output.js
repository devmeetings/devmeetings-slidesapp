define(['module', '_', 'slider/slider.plugins', 'services/Sockets'], function(module, _, sliderPlugins) {
    'use strict';

    var path = sliderPlugins.extractPath(module);

    sliderPlugins.directive('slideWorkspaceOutput', [
        '$timeout', '$window', '$rootScope', 'Sockets',
        function($timeout, $window, $rootScope, Sockets) {
            return {
                restrict: 'E',
                templateUrl: path + '/slide-workspace-output.html',
                link: function(scope, element) {

                    sliderPlugins.listen(scope, 'slide.slide-workspace.change', function(workspace) {
                        scope.contentUrl = 'waiting';
                        Sockets.emit('slide.slide-workspace.change', workspace, function(contentUrl) {

                            scope.$apply(function() {
                                scope.contentUrl = contentUrl.hash;
                            });
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
                        swapFramesLater();
                    });

                    var swapFramesLater = _.throttle(function() {
                        var oldFrame = currentFrame;
                        currentFrame += 1;
                        currentFrame = currentFrame % $iframes.length;
                        if (scope.workspace.singleOutput) {
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
                        }, 200);
                        
                        

                    }, 500, {
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