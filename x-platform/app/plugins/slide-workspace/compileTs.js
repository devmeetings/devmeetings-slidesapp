var ts = require('typescript');
var fs = require('fs');

module.exports = function compileTsAndReturnSemanticErrors (getSlideContent, getFiles, req, res) {
  getSlideContent(req.params.hash).done(function (slide) {
    if (!slide || !slide.workspace) {
      res.sendStatus(404);
      return;
    }
    var workspace = getFiles(slide.workspace);

    console.log(workspace);
    var errors = compileTsFilesAndGetErrors(workspace);
    res.send(flatten([
      '<html><head>',
      '<style>',
      '.error { color: #a44; }',
      '.error strong { color: #f44; }',
      '</style>',
      '</head><body>',
      '<div>',
      errors.map(function (err) {
        return [
          '<div class="error">',
          '<strong>' + err.filePath + ':' + (err.startPos.line + 1) + ':' + (err.startPos.col + 1) + '</strong>',
          '<pre>' + err.message
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(err.preview, function (x) {
              return '<strong>' + x + '</strong>';
            }) + '</pre>',
          '</div>'
        ];
      }),
      '</div>',
      '</body></html>'

    ]).join('\n'));
  });
};

function compileTsFilesAndGetErrors (workspace) {
  workspace = fixFileNames(workspace);

  // Extract tsFiles
  var tsFiles = Object.keys(workspace).filter(function (fileName) {
    return /\.ts$/i.test(fileName);
  });

  // set proper ts.sys implementation
  extend(ts.sys, tsSysForWorkspace(workspace));

  // run the compiler
  var program = ts.createProgram(
    tsFiles,
    {
      diagnostics: true,
      target: 1, // es5
      module: 4, // system
      experimentalDecorators: true,
      emitDecoratorMetadata: true
    }
  );
  var emitResult = program.emit(undefined, function (fileName, content) {
    // ignore output
  });
  var diagnostics =
    []
    .concat(program.getOptionsDiagnostics())
    .concat(program.getGlobalDiagnostics())
    .concat(program.getSyntacticDiagnostics())
    .concat(program.getSemanticDiagnostics())
    .concat(emitResult.diagnostics);
  return diagnostics.filter(function (d) {
    return !!d.file;
  }).map(diagnosticToTSError);
}

function tsSysForWorkspace (workspace) {
  return {
    newLine: '\n',
    readFile: function (fileName, encoding) {
      fileName = fileName.replace(/\.ts\.ts$/, '.ts');
      console.log('readFile', arguments);
      var f = workspace[fileName];
      if (f) {
        return f;
      }

      if (fs.existsSync(fileName)) {
        var c = fs.readFileSync(fileName, encoding);
        return c.toString();
      }

      return '';
    },
    writeFile: function () {
      console.log('writeFile', arguments);
    },
    resolvePath: function (path) {
      console.log('resolvePath', arguments);
      return path;
    },
    fileExists: function (path) {
      path = path.replace(/\.ts\.ts$/, '.ts');
      console.log('fileExists', arguments);
      return !!workspace[path];
    },
    directoryExists: function (path) {
      console.log('directoryExists', arguments);
      return true;
    }
  };
}

function fixFileNames (workspace) {
  return Object.keys(workspace).reduce(function (memo, k) {
    var newName = k.replace(/\|/g, '.');
    memo[newName] = workspace[k];
    return memo;
  }, {});
}

function flatten (arr) {
  if (!arr || !arr.reduce) {
    return [arr];
  }

  return arr.reduce(function (memo, v) {
    return memo.concat(flatten(v));
  }, []);
}

function extend (a, b) {
  Object.keys(b).forEach(function (k) {
    a[k] = b[k];
  });
}

function diagnosticToTSError (diagnostic) {
  var filePath = diagnostic.file.fileName;
  var startPosition = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
  var endPosition = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start + diagnostic.length);

  return {
    filePath: filePath,
    startPos: { line: startPosition.line, col: startPosition.character },
    endPos: { line: endPosition.line, col: endPosition.character },
    message: ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n'),
    preview: diagnostic.file.text.substr(diagnostic.start, diagnostic.length)
  };
}
