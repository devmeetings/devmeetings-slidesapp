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

  function tpl(obj) {
    var elem = document.createElement(obj.pluginName);
    elem.setAttribute('data', 'context["' + obj.trigger + '"]');
    elem.setAttribute('context', 'context');
    elem.setAttribute('mode', 'mode');
    elem.setAttribute('path', obj.path);
    elem.setAttribute('recorder', 'recorder');
    return elem;
  }

  slider.directive('pluginsLoader',
    function($compile) {
      return {
        restrict: 'E',
        scope: {
          namespace: '=',
          context: '=',
          mode: '=',
          recorder: '=',
          path: '@'
        },
        template: '',
        link: function($scope, $element) {
          var childScope = $scope.$new();

          var pluginTpl = function(plugin) {
            return tpl({
              pluginName: plugin.plugin,
              trigger: plugin.trigger,
              path: $scope.path + '.' + plugin.trigger
            });
          };


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

            var plugins = Plugins.getPlugins($scope.namespace).reduce(function(memo, plugin) {
              if (plugin.trigger !== '*' && newContext[plugin.trigger] === undefined) {
                return memo;
              }

              memo.push(pluginTpl(plugin));
              return memo;
            }, []);

            plugins.map(function(plugin, idx) {
              setTimeout(function() {
                var el = $compile(plugin)(childScope);
                $element.append(el);
              }, 100 * idx);
            });
          };

          $scope.$watch('context', refresh);
        }
      };
    }
  );
});
