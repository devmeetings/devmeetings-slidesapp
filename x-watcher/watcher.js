var _ = require('lodash');
var fs = require('fs');
var Q = require('q');
var gaze = require('gaze');
var path = require('path');
var domain = require('domain');
var Immutable = require('immutable');
var EventEmitter = require('events').EventEmitter;

var d = domain.create();
d.on('error', function(err) {
  console.error(err);
  throw err;
});


module.exports = function(cwd) {
  var ctrl = new EventEmitter();

  gaze(buildPattern(cwd), d.intercept(function(watcher) {
    ctrl.close = function() {
      watcher.close();
    };

    console.log("Started watching");

    var modelPromise = createInitialModel(watcher.relative());
    modelPromise.done(function(model) {
      ctrl.emit('model', null, model);
    });

    watcher.on('all', function(event, filepath) {
      modelPromise = modelPromise.then(function(model) {
        return applyChange(cwd, model, filepath).then(function(newModel) {
          if (model !== newModel) {
            ctrl.emit('model', model, newModel);
          }
          return newModel;
        });
      });
    });
  }));

  return ctrl;
};



function normalizePath(path) {
  return path.replace('\\', '/');
}

function readFileFromDir(dirPath, fileName) {
  var filePath = path.join(dirPath, fileName);

  return Q.ninvoke(fs, 'stat', filePath).then(function(stat) {
    if (!stat.isFile()) {
      return null;
    }

    return Q.ninvoke(fs, 'readFile', filePath, 'utf8').then(function(fileContent) {
      return {
        filePath: filePath,
        content: fileContent
      };
    });
  });
}

function createInitialModel(files) {

  function readFilesFromDir(dirPath) {
    var relativeFiles = files[dirPath];
    return Q.all(relativeFiles.map(readFileFromDir.bind(null, dirPath)));
  }

  function convertFilesToModel(filesPromises) {
    var model = _.flatten(filesPromises)
      .filter(_.identity)
      .reduce(function(model, file) {
        var normalizedPath = normalizePath(file.filePath);
        model[normalizedPath] = {
          content: file.content
        };
        return model;
      }, {
      });

    return Immutable.Map(model);
  }

  return Q.all(
    Object.keys(files).map(readFilesFromDir)
  ).then(convertFilesToModel);

}

function applyChange(cwd, model, filepath) {

  function updateModelIfNeeded(fileContent) {
    if (!fileContent) {
      return model;
    }

    // finding relative Path
    var relativePath = path.relative(cwd, filepath);
    var normalizedPath = normalizePath(relativePath);

    return model.set(relativePath, {
      content: fileContent.content
    });
  }

  return readFileFromDir(filepath, '')
    .then(updateModelIfNeeded);
}

function buildPattern(cwd) {
  var ignore = [
    'node_modules/**',
    '.gitignore',
    '.idea/**'
  ];

  return [cwd + '/**/*'].concat(ignore.map(function(pattern) {
    return '!' + cwd + '/' + pattern;
  }));
}
