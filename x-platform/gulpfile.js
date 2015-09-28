var fs = require('fs');
var open = require('open');
var fork = require('child_process').fork;
var del = require('del');
var Q = require('q');
var merge = require('merge-stream');

var generatePlugins = require('./public/dm-plugins/generatePlugins');

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

var SERVER_PORT = 3000;
var VERSION_FILE = __dirname + '/.version';
var SERVICE_WORKER = __dirname + '/public/worker.js';

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

gulp.task('install_hooks', function () {
  return gulp.src('./hooks/pre-push.sample')
      .pipe($.rename('pre-push'))
      .pipe(gulp.dest('../.git/hooks/'));
});

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
  var worker = fs.readFileSync(SERVICE_WORKER, 'utf8');
  worker = worker.replace(/var CACHE_VERSION.*/, 'var CACHE_VERSION = \'' + version + '\';');
  fs.writeFileSync(SERVICE_WORKER, worker);
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

gulp.task('less-external', function () {
  var buildLess = gulp.src('./public/less/base-external-styles.less')
    .pipe($.less())
    .pipe($.rename('xpla-styles.css'))
    .pipe(gulp.dest('./public/bin/xpla-styles'));

  var copyFonts = gulp.src('./public/fonts/*')
    .pipe(gulp.dest('./public/bin/xpla-styles/fonts'));

  var copyFontAwesome = gulp.src('./public/jspm_packages/npm/font-awesome@4.3.0/fonts/*')
    .pipe(gulp.dest('./public/bin/xpla-styles/fonts'));

  return merge([buildLess, copyFonts, copyFontAwesome]);
});

gulp.task('lint', function () {
  return gulp.src(withIgnores(['**/*.js']))
    .pipe($.semistandard())
    .pipe($.semistandard.reporter('default', {
      breakOnError: true
    }));
});

gulp.task('test', function () {
  var karmaOpts = {
    configFile: 'karma.conf.js',
    action: 'run'
  };

  var isCi = process.argv.filter(function (x) {
    return x === '--ci';
  }).length;

  if (isCi) {
    karmaOpts.browsers = ['PhantomJS'];
  }

  return gulp.src(withIgnores(['**/*-spec123.js']))
    .pipe($.karma(karmaOpts))
    .on('error', function (err) {
      throw err;
    });
});

gulp.task('serve', ['less', 'generate_plugins', 'copy_theme'], function () {
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
  gulp.watch(withIgnores(['./public/**/*.js']), $.livereload.reload);
  gulp.watch(withIgnores(['./public/**/*.jade']), function () {
    $.livereload.reload();
  });
});

// Build the whole platform

function runJspm (args) {
  return Q.denodeify(fork)('./node_modules/.bin/jspm', args).then(function (data) {
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
    ['dm-slider/slider-slide', location('slider-slide')],
    ['dm-slider/slider-deck', location('slider-deck')],
    ['dm-slider/slider-trainer', location('slider-trainer')],
    ['dm-xplatform/dm-xplatform', location('dm-xplatform')],
    ['dm-dashboard/dm-dashboard', location('dm-dashboard')]
    // runJspmBundle('dm-courses/dm-courses', location('dm-courses'))
  ];

  jobs.reduce(function (memo, args) {
    return memo.then(function () {
      return runJspmBundle.apply(null, args);
    });
  }, Q.when()).then(function () {
    cb();
  });
});

gulp.task('default', ['serve']);
