define(['_', 'slider/slider', '../utils/Plugins'], function(_, slider, Plugins) {

    var keys = function(obj) {
        return Object.keys(obj || {});
    };

    var hasSameKeys = function(obj1, obj2) {
        var keys1 = keys(obj1),
            keys2 = keys(obj2);

        if (keys1.length !== keys2.length) {
            return false;
        }

        var newKeys = keys1.filter(function(val) {
            return keys2.indexOf(val) === -1;
        });
        return newKeys.length === 0;
    };

    slider.directive('pluginsLoader', ['$compile',
        function($compile) {
            return {
                restrict: 'E',
                scope: {
                    namespace: '=',
                    context: '=',
                    mode: '@'
                },
                template: '',
                controller: ['$scope', '$element', '$rootScope',
                    function($scope, $element, $rootScope) {
                        var tpl = _.template('<<%= pluginName %> data="context[\'<%=trigger%>\']" context="context" mode="{{ mode }}"></<%= pluginName%>>');

                        var childScope = $scope.$new();

                        var refresh = function(newContext, oldContext) {
                            if (!newContext) {
                                return;
                            }
                            if (newContext !== oldContext && hasSameKeys(newContext, oldContext)) {
                                // Just broadcast info about new context
                                childScope.$broadcast('slide:update');
                                return;
                            }

                            $element.empty();
                            childScope.$destroy();
                            childScope = $scope.$new();

                            var pluginTpl = function(plugin) {
                                return tpl({
                                    pluginName: plugin.plugin,
                                    trigger: plugin.trigger
                                });
                            };
                            var plugins = Plugins.getPlugins($scope.namespace).reduce(function(memo, plugin) {
                                if (plugin.trigger !== '*' && newContext[plugin.trigger] === undefined) {
                                    return memo;
                                }

                                return memo + pluginTpl(plugin);

                            }, '');
                            var el = $compile(plugins)(childScope);
                            $element.append(el);
                        };

                        $scope.$watch('context', refresh);
                    }
                ]
            };
        }
    ]);
});