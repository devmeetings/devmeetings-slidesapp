var fs = require('fs');
var open = require('open');
var exec = require('child_process').exec;
var del = require('del');
var Q = require('q');

var generatePlugins = require('./public/dm-plugins/generatePlugins');

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

var SERVER_PORT = 3000;
var VERSION_FILE = __dirname + '/.version';
var version = (function () {
  try {
    return fs.readFileSync(VERSION_FILE, 'utf8');
  } catch (e) {
    return 'dev';
  }
}());

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

gulp.task('clean', function (cb) {
  runJspm(['unbundle']);
  del([
    VERSION_FILE,
    './public/bin/**'
  ], cb);
});

gulp.task('bump_version', ['clean'], function () {
  var pkg = require('./package.json');
  var buildDate = new Date().getTime() % 1e12;
  var buildNo = process.env.BUILD_NUMBER;

  var build = buildNo || buildDate;
  version = pkg.version + '.' + build;

  fs.writeFileSync(VERSION_FILE, version);
});

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
    .pipe($.rename('style-' + version + '.css'))
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

  function later (f) {
    setTimeout(f, 2000);
  }
  var isOpened = false;
  $.nodemon({
    script: 'app.js',
    ext: 'jade js',
    delay: '1000ms',
    ignore: ['public', 'node_modules'],
    tasks: ['less', 'jade'],
    env: {
      PORT: SERVER_PORT
    }
  }).on('start', function () {
    if (isOpened) {
      later(function () {
        $.livereload.reload();
      });
      return;
    }
    isOpened = true;
    later(function () {
      open('https://localhost:' + SERVER_PORT);
    });
  });

  gulp.watch(withIgnores(['./public/**/*.less']), ['less']);
});

// Build the whole platform

function runJspm (args) {
  return Q.denodeify(exec)('./node_modules/.bin/jspm ' + args.map(function (arg) {
    return '"' + arg + '"';
  }).join(' ')).then(function (data) {
    console.log(data.stdout);
    console.log(data.stderr);
  });
}
function runJspmBundle (moduleName, target) {
  var args = ['bundle', moduleName, target, '--inject'];
  return runJspm(args);
}

gulp.task('build', ['lint', 'jade', 'less', 'copy_theme', 'generate_plugins'], function (cb) {
  var location = function (loc) {
    return './public/bin/' + loc + '-' + version + '.js';
  };

  var jobs = [
    runJspmBundle('dm-slider/slider-slide', location('slider-slide')),
    runJspmBundle('dm-slider/slider-deck', location('slider-deck')),
    runJspmBundle('dm-slider/slider-trainer', location('slider-trainer')),
    runJspmBundle('dm-xplatform/dm-xplatform', location('dm-xplatform')),
    runJspmBundle('dm-courses/dm-courses', location('dm-courses'))
  ];

  Q.all(jobs).then(function () {
    cb();
  }, cb);
});

