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
  mkdirp = Q.denodeify(require('mkdirp')),
  requireLike = require('require-like');

temp.track();

function run(obj, env, consoleMock, cb) {

  var files = obj.files; 
  var indexFile = '/index.js';

  if (!files[indexFile]) {
    throw new Error('Missing ' + indexFile);
  }

  Q.ninvoke(temp, 'mkdir', 'node_runner').then(function(dir) {

    return Q.all(Object.keys(files).map(function(file) {

      var content = files[file].content;
      var filename = path.join(dir, file);
      
      var currentDir = path.dirname(filename);
      var promise = Q.when();
      if (currentDir !== dir) {
        promise = mkdirp(currentDir);
      }

      return promise.then(function(){
        return Q.ninvoke(fs, 'writeFile', filename, content);
      });

    })).then(function() {

      return dir;

    });

  }).then(function(dir) {

    fs.symlinkSync(
      path.join(__dirname, 'modules', 'node_modules'),
      path.join(dir, 'node_modules')
    );

    process.chdir(dir);

    function prepareGlobals(fileName, fileDir) {

      function requireMock(mod) {
        var requireInPath = requireLike(path.join(fileDir, fileName));
        var newFile = requireInPath.resolve(mod);
        var file = newFile.replace(dir, '');

        var isSafeModule = !!safeRequires[mod];
        var isFile = !!files[file];

        if (!isSafeModule && !isFile) {
          throw Error('Unknown / Not allowed module: ' + mod);
        }

        if (isFile) {
          var globals = prepareGlobals('/' + path.basename(newFile), path.dirname(newFile));
          return vm.runInNewContext(files[file].content, globals);
        }
    
        return requireInPath(mod);
      }

      var mod = {
        exports: {}
      };
      var globals = safeGlobals();
      globals.console = consoleMock;
      globals.require = requireMock;
      globals.module = mod;
      globals.exports = mod.exports;
      globals.process = {
        on: process.on.bind(process),
        exit: process.exit.bind(process),
        env: env
      };
      globals.__filename = fileName.replace('/', '');
      globals.__dirname = fileDir;

      return globals;
    }
   
    var globals = prepareGlobals(indexFile, dir);
    // Invoke index.js file
    return vm.runInNewContext(files[indexFile].content, globals);

  }).done(function(data) {
    cb(null, data);
  }, function(err) {
    cb(err);
  });

}

module.exports = run;
