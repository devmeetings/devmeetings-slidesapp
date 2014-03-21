define(['_', 'slider/slider', '../utils/Plugins'], function(_, slider, Plugins) {
    slider.directive('pluginsLoader', ['$compile',
        function($compile) {
            return {
                restrict: 'E',
                scope: {
                    namespace: '=',
                    context: '='
                },
                template: '',
                controller: ['$scope', '$element',
                    function($scope, $element) {
                        var tpl = _.template('<<%= pluginName %> data="context[\'<%=trigger%>\']" context="context"></<%= pluginName%>>');

                        $scope.$watch('context', function() {
                            $element.empty();

                            var plugins = Plugins.getPlugins($scope.namespace).reduce(function(memo, plugin) {
                                if ($scope.context[plugin.trigger] === undefined) {
                                    return memo;
                                }

                                return memo + tpl({
                                    pluginName: plugin.plugin,
                                    trigger: plugin.trigger
                                });

                            }, '');
                            var el = $compile(plugins)($scope);
                            $element.append(el);
                        });
                    }
                ]
            }
        }
    ]);
});