var builtInModules = require('./modules/builtin.json');
var requireWhitelist = require('./modules/readModules');
var safeGlobals = require('./modules/globals');


var safeRequires = [].concat(requireWhitelist).concat(builtInModules).reduce(function(memo, mod) {
  memo[mod] = true;
  return memo;
}, {});


var path = require('path'),
  temp = require('temp'),
  fs = require('fs'),
  Q = require('q'),
  vm = require('vm'),
  requireLike = require('require-like');

temp.track();

function run(obj, env, consoleMock, cb) {

  var files = obj.files || {
    '/index.js': obj.code
  };
  var indexFile = '/index.js';

  if (!files[indexFile]) {
    throw new Error('Missing ' + indexFile);
  }

  Q.ninvoke(temp, 'mkdir', 'node_runner').then(function(dir) {

    return Q.all(Object.keys(files).map(function(file) {

      var content = files[file];
      var filename = path.join(dir, file);
      return Q.ninvoke(fs, 'writeFile', filename, content);

    })).then(function() {

      return dir;

    });

  }).then(function(dir) {

    fs.symlinkSync(
      path.join(__dirname, 'modules', 'node_modules'),
      path.join(dir, 'node_modules')
    );

    process.chdir(dir);

    // [ToDr] We need to provide a filename to make sure it works
    var requireInPath = requireLike(path.join(dir, 'index.js'));
    var globals = prepareGlobals(indexFile);
    var sandbox = vm.createContext(globals);

    function prepareGlobals(fileName) {
      var mod = {
        exports: {}
      };
      var globals = safeGlobals();
      globals.console = consoleMock;
      globals.require = requireMock;
      globals.module = mod;
      globals.exports = mod.exports;
      globals.process = {
        env: env
      };
      globals.__filename = fileName.replace('/', '');
      globals.__dirname = dir;

      return globals;
    }

    function requireMock(mod) {
      var file = requireInPath.resolve(mod).replace(dir, '');
      var isSafeModule = !!safeRequires[mod];
      var isFile = !!files[file];

      if (!isSafeModule && !isFile) {
        throw Error('Unknown / Not allowed module: ' + mod);
      }

      if (isFile) {
        var prev = globals.__filename;
        globals.__filename = file.replace('/', '');
        var ret = vm.runInContext(files[file], sandbox);
        globals.__filename = prev;
        return ret;
      }
  
      return requireInPath(mod);
    }

   
    // Invoke index.js file
    return vm.runInContext(files[indexFile], sandbox);

  }).done(function(data) {
    cb(null, data);
  }, function(err) {
    cb(err);
  });

}

module.exports = run;
