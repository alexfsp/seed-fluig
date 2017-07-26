const $ = require('gulp-load-plugins')();
const gulp = require('gulp');
const params = require('./params')();


module.exports = function datasets() {
  gulp.src('src/datasets/*.js')
    .pipe($.tap(file =>
      gulp.src(file.path)
      .pipe($.injectPartials({
        start: '/*$$ {{path}}',
        end: '$$*/',
        removeTags: true
      }))
      .pipe($.babel(params.babelOptions))
      .pipe($.concat(file.relative))
      .pipe($.if(params.uglify, $.uglify(params.uglifyOptions)
        .on('error', $.util.log)))
      .pipe(gulp.dest(`${params.project}/datasets`))
    ));
};
