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

function sendError(e) {
  process.send({
    success: false,
    result: output.concat([e.toString()]),
    errors: [e.toString()],
    stacktrace: (e.stack || "build error").split("\n")
  });
}

function sendOutput(o) {
  if (!o) {
    return;
  }
  output.push(o.toString());

  process.send({
    success: true,
    result: output,
    errors: []
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
    series(commands, function(cmd, next){
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
    });
  }).done(null, function (err) {
    sendError(err);
  });

});

function series(arr, f) {
  function next() {
    var current = arr.shift();
    if (!current) {
      sendOutput("");
      return;
    }
    f(current, next);
  }

  next();
}
