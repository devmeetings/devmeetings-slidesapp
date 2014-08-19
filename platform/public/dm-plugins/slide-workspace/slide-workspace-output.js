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

                    scope.$watch('contentUrl', function(hash) {
                        element.find('iframe')[0].src = '/api/page/' + hash + "/";
                    });
                }
            };
        }
    ]);

});