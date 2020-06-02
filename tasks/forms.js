const $ = require('gulp-load-plugins')();
const gulp = require('gulp');
const params = require('./params')();

module.exports = function forms() {
  gulp.src('src/forms/*')
    .pipe($.tap((file) => {
      if (file.stat.isDirectory() && file.relative !== 'partials') {
        // ****** Busca o arquivo index.html
        gulp.src(`${file.path}/index.html`)
          //   injeta trechos parciais
          .pipe($.injectPartials({
            removeTags: true
          }))
          // se produção, compacta o html
          .pipe($.if(params.htmlmin, $.htmlmin({
            collapseWhitespace: true
          })))
          // envia para o diretório de projeto do fluig
          .pipe(gulp.dest(`${params.project}/forms/${file.relative}`));

        // ****** Busca os eventos
        gulp.src('src/forms/partials/events/**/*')
          // se produção, compacta o javascript
          .pipe($.babel(params.babelOptions))
          .pipe($.concat('events.js'))
          // .pipe($.if(params.uglify, $.uglify(params.uglifyOptions)
          //   .on('error', $.util.log)))
          // envia para o diretório de eventos do formulário
          .pipe(gulp.dest(`${params.project}/forms/${file.relative}/events/`));

        // ****** Busca os eventos
        gulp.src(`${file.path}/events/**/*`)
          // se produção, compacta o javascript
          .pipe($.babel(params.babelOptions))
          .pipe($.if(params.uglify, $.uglify(params.uglifyOptions)
            .on('error', $.util.log)))
          // envia para o diretório de eventos do formulário
          .pipe(gulp.dest(`${params.project}/forms/${file.relative}/events/`));

        // ***** recursos adicionais
        gulp.src(`${file.path}/resources/**/*`)
          .pipe(gulp.dest(`${params.project}/forms/${file.relative}/resources/`));

        gulp.src(`${file.path}/controller.js`)
          .pipe($.if(params.jsmap, $.sourcemaps.init()))
          .pipe($.babel(params.babelOptions))
          .pipe($.concat('custom.min.js'))
          .pipe($.if(params.uglify, $.uglify(params.uglifyOptions)
            .on('error', $.util.log)))
          .pipe($.if(params.jsmap, $.sourcemaps.write('.')))
          .pipe(gulp.dest(`${params.project}/forms/${file.relative}`));
      }
    }));
};
