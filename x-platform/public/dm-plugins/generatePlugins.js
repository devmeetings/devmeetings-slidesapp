var glob = require('glob');
var fs = require('fs');

module.exports = function () {
  glob(__dirname + '/**/*.js', function (err, files) {
    if (err) {
      throw err;
    }
    files = files
      .filter(function (file) {
        return file !== __filename;
      })
      .map(function (file) {
        file = file
        .replace(/.js$/, '')
        .replace(__dirname, '.');
        return file;
      }).filter(function (file) {
        return file !== './plugins' &&
          !/-spec$/.test(file);
      });

    var data = [
      '/* jshint esnext:true,-W097 */',
      '\'use strict\';',
      ''
    ].concat(files.map(function (file) {
      return 'import \'' + file + '\';';
    }));

    data.push('');

    fs.writeFile(__dirname + '/plugins.js', data.join('\n'), 'utf8');
  });
};
