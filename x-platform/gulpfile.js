var fs = require('fs');
var gulp = require('gulp');
var exec = require('child_process').exec;
var $ = require('gulp-load-plugins')();
var generatePlugins = require('./public/dm-plugins/generatePlugins');

function withIgnores (arr) {
  arr.push('!public/jspm_packages/**');
  arr.push('!public/components/**');
  arr.push('!public/bin/**');
  arr.push('!public/cdn/**');
  arr.push('!public/jspm.config.js');
  arr.push('!app/plugins/slide-ionic-download/app/**');
  arr.push('!node_modules/**');
  return arr;
}

gulp.task('generate_plugins', function () {
  return generatePlugins();
});

gulp.task('copy_theme', function () {
  return gulp.src('./public/dm-slider/theme-todr.js')
    .pipe(gulp.dest('./public/jspm_packages/github/ajaxorg/ace-builds@1.1.9'));
});

gulp.task('jade', function () {
  return gulp.src(withIgnores(['./public/**/*.jade']))
    .pipe($.jade({}))
    .pipe(gulp.dest('./public'));
});

gulp.task('less', function () {
  return gulp.src('./public/less/style.less')
    .pipe($.less())
    .pipe(gulp.dest('./public/bin'))
    .pipe($.livereload());
});

gulp.task('lint', function () {
  return gulp.src(withIgnores(['**/*.js']))
    .pipe($.semistandard())
    .pipe($.semistandard.reporter('default', {
      breakOnError: true
    }));
});

gulp.task('serve', ['generate_plugins', 'copy_theme'], function () {
  $.livereload.listen({
    port: 26000,
    key: fs.readFileSync('./config/certs/server.key', 'utf8'),
    cert: fs.readFileSync('./config/certs/server.crt', 'utf8')
  });

  $.nodemon({
    script: 'app.js',
    ext: 'jade js',
    delay: '100ms',
    ignore: ['public', 'node_modules'],
    tasks: ['less']
  });

  gulp.watch(withIgnores(['./public/**/*.less']), ['less']);
  gulp.watch(withIgnores(['**/*.js']), ['lint']);
});

// Build the whole platform

function runJspm (moduleName, target, cb) {
  var args = ['bundle', moduleName, target];
  exec('./node_modules/.bin/jspm ' + args.map(function (arg) {
    return '"' + arg + '"';
  }).join(' '), function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    cb(err);
  });
}

gulp.task('build', ['lint', 'less', 'copy_theme', 'generate_plugins'], function (cb) {
  var location = function (loc) {
    return './public/bin/' + loc;
  };

  runJspm('dm-xplatform/dm-xplatform', location('dm-xplatform.js'), cb);
});
