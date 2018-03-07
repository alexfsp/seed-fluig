const fs = require('fs');
const argv = require('yargs')
  .argv;

module.exports = function params() {
  const nodePackage = JSON.parse(fs.readFileSync('package.json'));

  const p = {};
  p.project = nodePackage.name;
  p.cliServer = nodePackage.cliServer;
  p.prod = argv.prod;
  p.uglify = argv.uglify;
  p.htmlmin = argv.htmlmin;
  p.watch = argv.watch;
  p.jsmap = argv.jsmap;
  p.export = argv.export;
  p.forms = [];
  p.uglifyOptions = {
    mangle: true,
    compress: {
      drop_console: true
    }
  };

  if (p.prod) {
    p.uglify = true;
    p.htmlmin = true;
    p.jsmap = false;
  }
  p.babelOptions = {
    presets: ['es2015'],
    ignore: [
      './node_modules/**/*.js',
      '../AngularFluig/**/*.js',
    ],
    plugins: ['transform-remove-strict-mode']
  };

  return p;
};
