define(['angular'], function(angular) {
    var module = angular.module(['slider.plugins'], []);

    module.extractPath = function(module) {
        var path = module.uri.split('/');
        path.pop();
        return path.join('/');
    };
    return module;
});