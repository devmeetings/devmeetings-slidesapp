var glob = require('glob');
var fs = require('fs');

glob(__dirname + '/**/*.js', function (err, files) {
  if (err) {
    res.send(404, err);
    return;
  }
  files = files.map(function (file) {
    file = file
    .replace(/.js$/, '')
    .replace(__dirname, '.');
    return file;
  });

  var data = [
    '/* jshint esnext:true,-W097 */',
    '\'use strict\';',
    '',
  ].concat(files.map(function(file) {
    return 'import \'' + file + '\';';
  }));

  data.push('');

  fs.writeFile('./plugins.js', data.join('\n'), 'utf8');
});
