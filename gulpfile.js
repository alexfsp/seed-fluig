const $ = require('gulp-load-plugins')();
const gulp = require('gulp');
const sequence = require('run-sequence');
const params = require('./tasks/params')();
const gnf = require('gulp-npm-files');

gulp.task('clean', () => gulp.src(['dist', `${params.project}/forms/**/*.*`, `${params.project}/datasets/**/*.*`, `${params.project}/wcm/widget/**/*.*`])
    .pipe($.rimraf({
      force: true
    })));

gulp.task('forms', require('./tasks/forms'));
gulp.task('datasets', require('./tasks/datasets'));
gulp.task('widgets', require('./tasks/widgets'));

gulp.task('build', (done) => {
  const tasks = [
    'forms', 'datasets', 'widgets'
  ];
  gulp.src(gnf(), { base: './' })
    .pipe(gulp.dest('./build'));

  sequence('clean', tasks, done);
});
gulp.task('default', ['build'], () => {
  if (params.watch) {
    gulp.watch(['src/forms/**/*'], ['forms']);
    gulp.watch(['src/datasets/**/*'], ['datasets']);
    gulp.watch(['src/widgets/**/*'], ['widgets']);
  }
});
