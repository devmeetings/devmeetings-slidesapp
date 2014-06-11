define(['_', 'slider/slider', '../utils/Plugins'], function(_, slider, Plugins) {
    slider.directive('pluginsLoader', ['$compile',
        function($compile) {
            return {
                restrict: 'E',
                scope: {
                    namespace: '=',
                    context: '=',
                    noRefresh: '='
                },
                template: '',
                controller: ['$scope', '$element', '$rootScope',
                    function($scope, $element, $rootScope) {
                        var tpl = _.template('<<%= pluginName %> data="context[\'<%=trigger%>\']" context="context"></<%= pluginName%>>');

                        var childScope = $scope.$new();

                        var refresh = function() {
                            if (!$scope.context) {
                                return;
                            }

                            $element.empty();
                            childScope.$destroy();
                            childScope = $scope.$new();

                            var plugins = Plugins.getPlugins($scope.namespace).reduce(function(memo, plugin) {
                                if (plugin.trigger !== '*' && $scope.context[plugin.trigger] === undefined) {
                                    return memo;
                                }

                                return memo + tpl({
                                    pluginName: plugin.plugin,
                                    trigger: plugin.trigger
                                });

                            }, '');
                            var el = $compile(plugins)(childScope);
                            $element.append(el);
                        };

                        if (!$scope.noRefresh) {
                            $scope.$watch('context', refresh);
                        } else {
                            if ($scope.context) {
                                refresh();
                            } else {
                                var isFired = false;
                                var refreshOnce = function() {
                                    if (!$scope.context || isFired) {
                                        return;
                                    }
                                    isFired = true;
                                    refresh();
                                };
                                $scope.$watch('context', refreshOnce);
                            }
                        }
                    }
                ]
            };
        }
    ]);
});
