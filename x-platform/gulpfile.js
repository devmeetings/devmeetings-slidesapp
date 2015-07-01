var fs = require('fs');
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

function publicPath (pattern) {
  return ['public/' + pattern, '!public/jspm_packages/**'];
}

gulp.task('copy_theme', function () {
  gulp.src('./public/dm-slider/theme-todr.js')
    .pipe(gulp.dest('./public/jspm_packages/github/ajaxorg/ace-builds@1.1.9'));
});

gulp.task('less', function () {
  gulp.src('./public/less/style.less')
    .pipe($.less())
    .pipe(gulp.dest('./public/bin'))
    .pipe($.livereload());
});

gulp.task('serve', function () {
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

  gulp.watch(publicPath('**/*.less'), ['less']);
});
