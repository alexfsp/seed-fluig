const $ = require('gulp-load-plugins')();
const gulp = require('gulp');
const fs = require('fs');
const params = require('./params')();
const embedTemplates = require('gulp-angular-embed-templates');

module.exports = function widgets() {
  gulp.src('src/widgets/*')
    .pipe($.tap((file) => {
      if (file.stat.isDirectory() && file.relative !== 'partials') {
        let vendor = [];
        try {
          vendor = JSON.parse(fs.readFileSync(`${file.path}/vendor.json`));
        } catch (err) {
          console.log(err);
        }

        const widgetDir = `${params.project}/wcm/widget/${file.relative}`;

        html(`${file.path}/**.html`, `${widgetDir}/src/main/resources`);
        image(`${file.path}/images/**/*`, widgetDir);
        templates(`${file.path}/templates/*`, widgetDir);
        js(`${file.path}/js/**/*.js`, `${widgetDir}/js`, 'script.min.js', true);
        statics(`${file.path}/resources/**.*`, `${widgetDir}/resources`);
        sass(`${file.path}/sass/*.scss`, `${widgetDir}/css`, false);

        if (vendor.fonts) {
          statics(vendor.fonts, `${widgetDir}/fonts`);
        }

        if (vendor.js) {
          js(vendor.js, `${widgetDir}/js`, 'vendor.min.js');
        }

        if (vendor.sass) {
          sass(vendor.sass, `${widgetDir}/css`);
        }

        war(file.path, widgetDir);
      }
    }));
};

function templates(src, dest) {
  gulp.src(src)
    .pipe($.tap((file) => {
      if (file.stat.isDirectory() && file.relative !== 'partials') {
        const template = file.relative;

        js(`${file.path}/**/*.js`, `${dest}/templates/${template}`, 'controller.js');
        html(`${file.path}/detalhe/index.html`, `${dest}/templates/${template}/detalhe`);
        html(`${file.path}/resumo/index.html`, `${dest}/templates/${template}/resumo`);
      }
    }));
}

function sass(src, dest) {
  gulp.src(src)
    .pipe($.sass()
      .on('error', $.sass.logError))
    .pipe($.if(params.uglify, $.uglifycss({
      "maxLineLen": 80,
      "uglyComments": true
    })))
    .pipe(gulp.dest(dest));
}

function statics(src, dest) {
  gulp.src(src)
    .pipe(gulp.dest(dest));
}

function js(src, dest, filename, templates) {
  gulp.src(src)
    .pipe($.if(templates, embedTemplates()))
    .pipe($.babel(params.babelOptions))
    .pipe($.concat(filename))
    .pipe($.if(params.uglify, $.uglify(params.uglifyOptions)
      .on('error', $.util.log)))
    .pipe(gulp.dest(dest));
}

function html(src, dest) {
  // ****** Busca os arquivos html da raiz
  gulp.src(src)
    //   injeta trechos parciais
    .pipe($.injectPartials({
      removeTags: true
    }))
    // se produção, compacta o html
    .pipe($.if(params.htmlmin, $.htmlmin({
      collapseWhitespace: true
    })))
    // envia para o diretório de projeto do fluig
    .pipe(gulp.dest(dest));
}

function image(src, dest) {
  gulp.src(src)
    .pipe($.imagemin({
      progressive: true
    }))
    .pipe(gulp.dest(`${dest}/images`));
}

function war(src, dest) {
  gulp.src(`${src}/application.info`)
    .pipe(gulp.dest(`${dest}/src/main/resources`));

  gulp.src(`${src}/jboss-web.xml`)
    .pipe(gulp.dest(`${dest}/src/main/webapp/WEB-INF`));

  gulp.src('src/widgets/web.xml')
    .pipe(gulp.dest(`${dest}/src/main/webapp/WEB-INF`));
}
