define(['_', 'angular', 'angular-sanitize', 'asEvented', '../utils/Plugins'], function(_, angular, angularSanitize, asEvented, Plugins) {
    var module = angular.module(['slider.plugins'], ['ngSanitize']);

    module.extractPath = function(module) {
        var path = module.uri.split('/');
        path.pop();
        return path.join('/');
    };

    _.extend(module, Plugins);
    asEvented.call(module);

    module.onLoad = function(cb) {
        module.on('load', cb);
    };

    // We have to remember about disabling listeners when scope is destroyed i.e. plugin is reloaded
    module.listen = function(scope, name, cb) {
        scope.$on('$destroy', function() {
            module.off(name, cb);
        });
        return module.on(name, cb);
    };
    return module;
});