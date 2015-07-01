var fs = require('fs');
var open = require('open');
var exec = require('child_process').exec;
var Q = require('q');

var generatePlugins = require('./public/dm-plugins/generatePlugins');

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

var SERVER_PORT = 3000;

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
    tasks: ['less', 'jade'],
    env: {
      PORT: SERVER_PORT
    }
  }).on('start', function () {
    open('https://localhost:' + SERVER_PORT);
  });

  gulp.watch(withIgnores(['./public/**/*.less']), ['less']);
});

// Build the whole platform

function runJspm (moduleName, target) {
  var args = ['bundle', moduleName, target, '--inject'];
  return Q.denodeify(exec)('./node_modules/.bin/jspm ' + args.map(function (arg) {
    return '"' + arg + '"';
  }).join(' ')).then(function (data) {
    console.log(data.stdout);
    console.log(data.stderr);
  });
}

gulp.task('build', ['lint', 'jade', 'less', 'copy_theme', 'generate_plugins'], function (cb) {
  var location = function (loc) {
    return './public/bin/' + loc;
  };

  var jobs = [
    runJspm('dm-slider/slider-slide', location('slider-slide.js')),
    runJspm('dm-slider/slider-deck', location('slider-deck.js')),
    runJspm('dm-slider/slider-trainer', location('slider-trainer.js')),
    runJspm('dm-xplatform/dm-xplatform', location('dm-xplatform.js')),
    runJspm('dm-courses/dm-courses', location('dm-courses.js'))
  ];

  Q.all(jobs).then(function () {
    cb();
  }, cb);
});

