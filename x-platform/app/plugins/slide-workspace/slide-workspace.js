var _ = require('lodash');
var mime = require('mime');
var States = require('../../services/states');
var Zip = require('node-zip');
var multiparty = require('connect-multiparty');
var fs = require('fs');
var Workspaces = require('../../models/slidesave');
var Q = require('q');

exports.initApi = function (app, authenticated, app2, router2, logger) {
  'use strict';

  app.post('/upload', authenticated, multiparty(), function (req, res) {
    fs.readFile(req.files.file.path, 'binary', function (err, data) {
      if (err) {
        res.send(400, err);
        return;
      }

      try {
        var zip = new Zip(data, {
          base64: false,
          checkCRC32: true
        });

        res.send(200, _.reduce(zip.files, function (memo, val, name) {
          if (val._data) {
            memo[getInternalFileName(name)] = val._data;
          }
          return memo;
        }, {}));
      } catch (e) {
        res.send(400, e);
      }
    });
  });

  app.get('/workspace/download/:hash', authenticated, downloadPage.bind(null, fetchWorkspace));
  app.get('/download/:hash', authenticated, downloadPage.bind(null, createStateFromId));

  app.get('/workspace/page/:hash/:file*', returnFile.bind(null, fetchWorkspace));
  app.get('/workspace/page/:hash', returnFile.bind(null, fetchWorkspace));

  app.get('/page/:hash/:file*', returnFile.bind(null, createStateFromId));
  app.get('/page/:hash', returnFile.bind(null, createStateFromId));

  function fetchWorkspace (workspaceId) {
    return Q.when(Workspaces.findById(workspaceId).exec()).then(function (slidesave) {
      return slidesave.slide;
    });
  }

  function createStateFromId (hash) {
    return States.createFromId(hash);
  }

  function downloadPage (getSlideContent, req, res) {
    getSlideContent(req.params.hash).then(function (slide) {
      var workspace = getFiles(slide.workspace);
      // Create zip file
      var zip = new Zip();
      _.each(workspace, function (val, name) {
        zip.file(getRealFileName(name), val);
      });

      var data = zip.generate({
        base64: false,
        compression: 'DEFLATE'
      });

      res.charset = 'utf8';
      res.set({
        'Content-type': 'application/zip',
        'Content-disposition': 'attachment; filename="' + req.params.hash + '.zip"'
      });
      res.send(new Buffer(data, 'binary'));

    }, function (err) {
      res.send(400, err);
    }).then(null, logger.error);
  }

  function returnFile (getSlideContent, req, res) {
    var file = req.params.file || 'index.html';
    var first = req.params[0];

    if (first && first !== '/') {
      file = file + first;
    }

    var internalFile = getInternalFileName(file);
    getSlideContent(req.params.hash).done(function (slide) {
      if (!slide || !slide.workspace) {
        res.sendStatus(404);
        return;
      }

      var workspace = getFiles(slide.workspace);
      var file = findFile(workspace, internalFile);
      if (!workspace || !file) {
        res.sendStatus(404);
        return;
      }
      // Send other files
      pushOtherFiles(res, workspace, internalFile);
      res.set('Content-Type', guessType(internalFile));
      res.send(file);
    }, logger.error);
  }
};

function pushOtherFiles (res, files, internalFile) {
  'use strict';
  if (!res.push) {
    return;
  }
  // Only push files if connection supports it
  // TODO [ToDr] Nginx currently does not support push in SPDY!
  Object.keys(files).filter(function (x) {
    return x !== internalFile;
  }).map(function (internalName) {
    var realName = getRealFileName(internalName);

    var content = files[internalName];
    if (!content) {
      return;
    }

    res.push(realName, {
      'Content-Type': guessType(internalName)
    }, function (err, stream) {
      if (err) {
        console.error(err);
      }
      stream.on('acknowledge', function () {
        console.log('acknowledge', internalName);
      });
      stream.on('error', function (err) {
        console.log('error', internalName, err);
      });

      stream.end(content);
    });
  });
}

function findFile (files, fileName) {
  'use strict';

  if (files[fileName]) {
    return files[fileName];
  }
  // Try preprocessing some files
  var nameParts = fileName.split('|');
  var l = nameParts.length;
  var ext = nameParts[l - 1];

  var extensionsToTry = [];
  // Try jade
  if (ext === 'html') {
    extensionsToTry = ['jade'];
  }
  // Try coffee
  if (ext === 'js') {
    extensionsToTry = ['coffee', 'es6'];
  }

  return extensionsToTry.map(function (ext) {
    nameParts[l - 1] = ext;
    var file = files[nameParts.join('|')];
    if (file) {
      try {
        return processFile(ext, file);
      } catch (e) {
        return e.toString();
      }
    }
  }).filter(function (x) {
    return !!x;
  })[0];
}

function processFile (ext, content) {
  'use strict';

  if (ext === 'jade') {
    return require('jade').render(content, {});
  }
  if (ext === 'coffee') {
    return require('coffee-script').compile(content);
  }
  if (ext === 'es6') {
    var hasImport = content.indexOf('import') !== -1;
    var hasExport = content.indexOf('export') !== -1;
    var module = hasImport || hasExport ? 'amd' : 'common';

    return require('babel').transform(content, {
      modules: module
    }).code;
  }
  return content;
}

function guessType (fileName) {
  'use strict';

  var name = fileName.split('|');
  var ext = name[name.length - 1];
  return mime.lookup(ext);
}

function getInternalFileName (file) {
  'use strict';
  return file.replace(/\./g, '|');
}

function getRealFileName (file) {
  'use strict';
  return file.replace(/\|/g, '.');
}

function getFiles (data) {
  'use strict';
  var files = {};
  _.each(data.tabs, function (val, key) {
    files[key] = val.content;
  });
  return files;
}
