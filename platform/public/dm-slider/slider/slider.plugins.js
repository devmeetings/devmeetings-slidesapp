define(
    ['_', 'angular', 'angular-sanitize', 'asEvented',
    'dm-modules/dm-sockets/dm-sockets',
    '../utils/Plugins', '../utils/ExtractPath',
        'dm-modules/dm-user/dm-user'],
        function(_, angular, angularSanitize, asEvented, Sockets, Plugins, ExtractPath) {

    var module = angular.module('slider.plugins', ['ngSanitize', 'angularFileUpload', 'dm-sockets', 'dm-user']);

    module.extractPath = ExtractPath;

    _.extend(module, Plugins);
    asEvented.call(module);

    module.onLoad = function(cb) {
        module.on('load', cb);
    };

    // Override trigger
    var trigger = module.trigger;
    module.trigger = function(name) {
        var args = [].slice.call(arguments);

        // trigger star event
        trigger.apply(module, ['*'].concat(args));

        // Now trigger regular event
        return trigger.apply(module, args);
    };

    // We have to remember about disabling listeners when scope is destroyed i.e. plugin is reloaded
    module.listen = function(scope, name, cb) {
        scope.$on('$destroy', function() {
            module.off(name, cb);
        });
        return module.on(name, cb);
    };

    //forward
    var forwarding = {};
    module.forwardEventToServer = function(evName, Sockets) {
        if (forwarding[evName]) {
            return;
        }

        module.on(evName, function(/*args*/) {
            Sockets.emit(evName, [].slice.call(arguments));
        });
        forwarding[evName] = true;
    };
    return module;
});
