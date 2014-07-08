define([], function () {
    return function (module) {
        var path = module.uri.split('/'); 
        path.pop();
        return path.join('/');
    };
});
