var _ = require('lodash');
var fs = require('fs');
var Q = require('q');
var gaze = require('gaze');
var path = require('path');
var domain = require('domain');

var d = domain.create();
d.on('error', function(err) {
  console.error(err);
  throw err;
});

var cwd = process.cwd();

function normalizePath(path) {
  return path.replace('\\', '/');
}

gaze(buildPattern(), d.intercept(function(watcher) {

  console.log("Started watching");

  var model = createInitialModel(this.relative());

  model.done(function(m) {
    console.log(m);
  });

  watcher.on('all', function(event, filepath) {
    model = model.then(function(model) {
      applyChange(model, filepath);
    });
  });

}));



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
    return _.flatten(filesPromises)
      .filter(_.identity)
      .reduce(function(model, file) {
        var normalizedPath = normalizePath(file.filePath);
        model.tabs[normalizedPath] = {
          content: file.content
        };
        return model;
      }, {
        tabs: {}
      });
  }

  return Q.all(
    Object.keys(files).map(readFilesFromDir)
  ).then(convertFilesToModel);

}

function applyChange(model, filepath) {

  function updateModelIfNeeded(fileContent) {
    if (!fileContent) {
      return;
    }

    // finding relative Path
    var relativePath = path.relative(cwd, filepath);
    var normalizedPath = normalizePath(relativePath);
    model.tabs[relativePath] = {
      content: fileContent
    };
  }

  function returnModel() {
    return model;
  }

  return readFileFromDir(filepath, '')
    .then(updateModelIfNeeded)
    .then(returnModel);
}

function buildPattern() {
  var ignore = [
    'node_modules/**',
    '.gitignore',
    '.idea/**'
  ];

  return ['**/*'].concat(ignore.map(function(pattern) {
    return '!' + pattern;
  }));
}
