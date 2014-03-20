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
                link: function($scope, $element) {

                    var tpl = _.template('<<%= pluginName %> data="context[\'<%=trigger%>\']" context="context"></<%= pluginName%>>');

                    var plugins = Plugins.getPlugins($scope.namespace).reduce(function(memo, plugin) {
                        console.log(plugin);
                        if ($scope.context[plugin.trigger] === undefined) {
                            return memo;
                        }

                        return memo + tpl({
                            pluginName: plugin.name,
                            trigger: plugin.trigger
                        });

                    }, '');
                    console.log(plugins);

                    var el = $compile(plugins)($scope);
                    $element.append(el);
                }
            }
        }
    ]);
});