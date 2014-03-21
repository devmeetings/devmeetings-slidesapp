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
    return module;
});