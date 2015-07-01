var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

function publicPath (pattern) {
  return ['public/' + pattern, '!public/jspm_packages/**'];
}

gulp.task('less', function () {
  gulp.src('./public/less/style.less')
    .pipe($.less())
    .pipe(gulp.dest('./public/bin'))
    .pipe($.livereload());
});

gulp.task('watch', function () {
  $.livereload.listen();

  gulp.watch(publicPath('**/*.less'), 'less');
});
