// Any process cannot run longer then 120 seconds
var PROCESSTIMEOUT = 120000;

var temp = require('temp');
var Q = require('q');
var path = require('path');
var fs = require('fs');
var mkdirp = Q.denodeify(require('mkdirp'));
var child_process = require('child_process');

temp.track();

setTimeout(function () {
  process.exit(-2);
}, PROCESSTIMEOUT);

var output = [];
var errors = [];

function sendError(e) {
  console.error(e, e.stack.split("\n"));
  errors.push(e.toString());

  process.send({
    success: false,
    result: output.concat([e.toString()]),
    errors: errors,
    stacktrace: (e.stack || "build error").split("\n")
  });
}

function sendOutput(o, files) {
  if (!o) {
    return;
  }
  output.push(o.toString());

  process.send({
    success: true,
    result: output,
    errors: errors,
    newFiles: files
  });
}

process.on("uncaughtException", function(e) {
  sendError(e);
  process.exit(-1);
});

//This code is ran in a separate process and just listens for the message which contains code to be executed
process.once('message', function(msg) {
  var obj = msg.msg;
  var env = msg.env;
  var commands = msg.commands;

  // Create file structure on disk
  var files = obj.files; 
  Q.ninvoke(temp, 'mkdir', 'fs_runner').then(function(dir) {
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
    process.chdir(dir);

    // run commands
    series(commands, function(cmd, next) {
      var o = child_process.spawn(cmd[0], cmd.slice(1), {
        cwd: dir,
        env: env,
        stdio: 'pipe',
        timeout: PROCESSTIMEOUT,
        killSignal: 'SIGKILL'
      });
      o.stdout.on('data', sendOutput);
      o.stdout.on('end', sendOutput);
      o.stderr.on('data', sendOutput);
      o.stderr.on('end', sendOutput);
      o.on('error', sendError);
      o.on('exit', function(code) {
        if (code === 0) {
          next();
          return;
        }
        sendError(JSON.stringify(cmd) + ' exited with ' + code);
      });
    }, function () {
      onFinish(dir)
    });
  }).done(null, function (err) {
    sendError(err);
  });
});

function onFinish(dir) {
  // we need to find created files
  // TODO hacky solution for now!
  return Q.ninvoke(fs, 'readdir', '.')
    .then(function (files) {
      var pattern = /\.(js|html)$/i;
      var newFiles = files.filter(function (f) {
        return f.match(pattern);
      });
      // Read all files
      return Q.all(newFiles.map(function (f) {
        return Q.ninvoke(fs, 'readFile', f, 'utf8').then(function (content) {
          var type = f.match(pattern)[1];
          return {
            name: f,
            content: content,
            mimetype: getMimeType(type.toLowerCase())
          };
        });
      }));
    })
    .then(function (newFiles) {
      var names = newFiles.map(function (f) {
        return f.name;
      });
      sendOutput('New files: ' + names.join(','), newFiles);
    })
    .then(null, sendError);
}

function getMimeType(type) {
  if (type === 'html') {
    return 'text/html';
  }

  return 'application/javascript';
};

function series(arr, f, onFinish) {
  function next() {
    var current = arr.shift();
    if (!current) {
      sendOutput(" ");
      if (onFinish) {
        onFinish();
      }
      return;
    }
    f(current, next);
  }

  next();
}
