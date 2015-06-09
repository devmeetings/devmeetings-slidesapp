define(
  ['_', 'angular', 'angular-sanitize',
    'angular-qr',
    'asEvented',
    'dm-modules/dm-sockets/dm-sockets',
    'dm-modules/dm-editor/dm-editor',
    'dm-modules/dm-recorder/dm-recorder',
    '../utils/Plugins', '../utils/ExtractPath'
  ],
  function(_, angular, angularSanitize, angularQr, asEvented, Editor, Sockets, DmRecorder, Plugins, ExtractPath) {
    'use strict';

    var module = angular.module('slider.plugins', [
      'ngSanitize', 'angularFileUpload', 'ja.qr',
      'dm-sockets', 'dm-editor', 'dm-recorder'
    ]);

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

      module.on(evName, function( /*args*/ ) {
        Sockets.emit(evName, [].slice.call(arguments));
      });
      forwarding[evName] = true;
    };
    return module;
  });
