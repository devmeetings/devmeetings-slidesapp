var requireWhitelist = [
  'express', 'http', 'path', 'vm', 'cors',
  'crypto', 'net', 'https', 'util', 'url', 'zlib', 'tty',
  'socket.io', 'connect', 'concat-stream', 'websocket', 'npmlog', 'semver',
  'events', 'stream', 'domain', 'fs', 'edge'
];


var SandboxedModule = require('sandboxed-module'),
  path = require('path');

function run(obj, env, consoleMock) {
  var files = obj.files || {
    '/index.js': obj.code
  };
  
  var options = {
    requires: {
      fs: {
        readFileSync: function(name) {
          return files[name];
        }
      }
    },
    globals: {
      console: consoleMock,
      process: {
        env: env,
        cwd: function() {
          return '/';
        }
      }
    },

    locals: {
      __dirname: '/',
      __filename: 'index.js',
    },

    readFileSync: function(name) {
      if (name.indexOf('node_modules') !== -1) {
        return require('fs').readFileSync(name, 'utf8');
      }
      return readFile(files, name);
    },

    requireLikeResolve: function(origin, name) {
      if (origin.indexOf('node_modules') !== -1) {
        return require('require-like')(origin).resolve(name);
      }
      if (name.indexOf('/') === 0) {
        return name;
      }
      if (name.indexOf('.') === 0) {
        var dir = path.dirname(origin);
        return path.join(dir, name + '.js');
      }
      return require('require-like')(origin).resolve(name);
    },

    requireLike: function(origin, name) {
      return require('require-like')(origin)(name); 
    }
  };

  SandboxedModule.require('./index', options);

}

function readFile(files, name) {
  name = name.replace(__dirname, '');

  if (!files[name]) {
    throw new Error('File not found: ' + name);
  }
  return files[name];
}

module.exports = run;
