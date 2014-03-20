define(['_', 'angular', 'angular-sanitize', '../utils/Plugins'], function(_, angular, angularSanitize, Plugins) {
    var module = angular.module(['slider.plugins'], ['ngSanitize']);

    module.extractPath = function(module) {
        var path = module.uri.split('/');
        path.pop();
        return path.join('/');
    };

    _.extend(module, Plugins);


    return module;
});