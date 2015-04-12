var _ = require('lodash');
var mime = require('mime');
var States = require('../../services/states');
var Zip = require('node-zip');
var multiparty = require('connect-multiparty');


exports.initApi = function(app, authenticated) {
  'use strict';
  
  app.post('/upload', authenticated, multiparty(), function(req, res) {
    require('fs').readFile(req.files.file.path, 'binary', function(err, data) {
      if (err) {
        res.send(400, err);
        return;
      }

      try {
        var zip = new Zip(data, {
          base64: false,
          checkCRC32: true
        });

        res.send(200, _.reduce(zip.files, function(memo, val, name) {
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

  app.get('/download/:hash', authenticated, function(req, res) {
    States.createFromId(req.params.hash).then(function(slide) {
      var workspace = getFiles(slide.workspace);
      // Create zip file
      var zip = new Zip();
      _.each(workspace, function(val, name) {
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

    }, function(err) {
      res.send(400, err);
    }).then(null, console.error);
  });
  
  
  app.get('/page/:hash/:file*', returnFile);
  app.get('/page/:hash', returnFile);

  function returnFile(req, res) {
    var file = req.params.file || 'index.html';
    var first = req.params[0];

    if (first && first !== '/') {
      file = file + first;
    }

    var internalFile = getInternalFileName(file);
    States.createFromId(req.params.hash).done(function(slide) {
      if (!slide) {
        res.send(404);
        return;
      }

      var workspace = getFiles(slide.workspace);
      var file = findFile(workspace, internalFile);
      if (!workspace || !file) {
        res.send(404);
        return;
      }

      res.set('Content-Type', guessType(internalFile));
      res.send(file);
    }, console.error);
  }
};

function findFile(files, fileName) {
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

  return extensionsToTry.map(function(ext) {
    nameParts[l - 1] = ext;
    var file = files[nameParts.join('|')];
    if (file) {
      try {
        return processFile(ext, file);
      } catch (e) {
        return e.toString();
      }
    }
  }).filter(function(x) {
    return !!x;
  })[0];
}

function processFile(ext, content) {
  'use strict';

  if (ext === 'jade') {
    return require('jade').render(content, {});
  }
  if (ext === 'coffee') {
    return require('coffee-script').compile(content);
  }
  if (ext === 'es6') {
    var module = content.indexOf('import') !== -1 ? 'amd' : 'common';

    return require('babel').transform(content, {
      modules: module
    }).code;
  }
  return content;
}

function guessType(fileName) {
  'use strict';

  var name = fileName.split('|');
  var ext = name[name.length - 1];
  return mime.lookup(ext);
}

function getInternalFileName(file) {
  'use strict';
  return file.replace(/\./g, '|');
}

function getRealFileName(file) {
  'use strict';
  return file.replace(/\|/g, '.');
}

function getFiles(data) {
  'use strict';
  var files = {};
  _.each(data.tabs, function(val, key) {
    files[key] = val.content;
  });
  return files;
}
