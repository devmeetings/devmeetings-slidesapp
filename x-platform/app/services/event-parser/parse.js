#!/usr/bin/env node

var fs = require('fs');
var path = require('path');
var yaml = require('js-yaml');

/**
 * Because we are parsing the file synchronously we are able to control currentDirectory with global variable.
 * I know it is shitty but can't think of other way to determine this.
 */
var currentDirectory = [];

var WorkspaceType = new yaml.Type('!workspace', {
  kind: 'mapping',
  resolve: function (dirName) {
    if (!dirName) {
      return;
    }
    if (!dirName.path) {
      return;
    }

    var d = getDirAndFileName(dirName.path);

    return fs.statSync(d.path).isDirectory;
  },

  construct: function (workspace) {
    var fileName = workspace.path;
    var d = getDirAndFileName(fileName);
    var files = fs.readdirSync(d.path);

    var hasIndex = files.indexOf('index.html') !== -1;
    var tabs = files.reduce(function (memo, file) {

      var key = getKeyFromFileName(file);
      var content = fs.readFileSync(path.join(d.path, file), 'utf8');
      memo[key] = {
        content: content
      };
      return memo;

    }, {});

    return {
      content: {
        name: workspace.name,
        workspace: {
          active: hasIndex ? 'index|html' : Object.keys(tabs)[0],
          size: 'xxl',
          tabs: tabs
        }
      }
    };
  }
});

var IncludeType = new yaml.Type('!include', {
  kind: 'scalar',

  resolve: function (fileName) {
    if (!fileName) {
      return false;
    }
    var d = getDirAndFileName(fileName);

    return fs.existsSync(d.path);
  },

  construct: function (fileName) {
    var d = getDirAndFileName(fileName);

    // TODO Only if file is yml!
    if (fileName.match(/.yml$/)) {
      return parseFile(d.dir, d.file);
    }
    return fs.readFileSync(d.path, 'utf8');
  }
});

var EventType = yaml.Schema.create([IncludeType, WorkspaceType]);

function getDirAndFileName (fileName) {
  var data = splitDirectoryAndName(fileName);
  data[0] = path.join(currentDirectory[currentDirectory.length - 1], data[0]);

  return {
    dir: data[0],
    file: data[1],
    path: path.join(data[0], data[1])
  };
}

function splitDirectoryAndName (fileName) {
  var p = fileName.split('/');
  var dir = p.slice(0, p.length - 1);

  return [path.join.apply(path, dir), p[p.length - 1]];
}

function getKeyFromFileName (fileName) {
  var parts = fileName.split('.');
  var ext = parts.pop();
  return parts.join('.') + '|' + ext;
}

function parseFile (dirname, filePath) {
  currentDirectory.push(dirname);
  var content = fs.readFileSync(path.join(dirname, filePath), 'utf8');
  var loaded = yaml.safeLoad(content, {
    schema: EventType
  });
  currentDirectory.pop();
  return loaded;
}

if (require.main !== module) {
  module.exports = parseFile;
} else {
  if (process.argv.length < 3) {
    console.error('Missing file');
    process.exit(1);
  }

  var file = process.argv[2];
  var data = splitDirectoryAndName(file);
  var json = parseFile(data[0], data[1]);

  console.log(JSON.stringify(json, null, 2));
}
