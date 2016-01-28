import 'babel-polyfill';
import dotenv from 'dotenv';
import gulp from 'gulp';
import del from 'del';
import fs from 'fs';
import path from 'path';
import rename from 'gulp-rename';
import replace from 'gulp-replace';
import gulpFilter from 'gulp-filter';
import webpack from 'webpack-stream';
import sourcemaps from 'gulp-sourcemaps';
import inlinesource from 'gulp-inline-source';
import eslint from 'gulp-eslint';
import jscs from 'gulp-jscs';
import flow from 'gulp-flowtype';
import scsslint from 'gulp-scss-lint';
import htmlhint from 'gulp-htmlhint';
import uglify from 'gulp-uglify';
import htmlmin from 'gulp-htmlmin';
import webserver from 'gulp-webserver';

dotenv.config({
  path: path.join(__dirname, '.env'),
});

const isProductionEnv = process.env.NODE_ENV === 'production';

function getWebpackConfig() {
  try {
    return require('./webpack.demo.config.js');
  } catch (ex) {
    return require('./webpack.config.js');
  }
}

function buildBaseApp(myWebpackConfig) {
  return gulp.src(['src/**/*.js', 'containers/**/*.js'])
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(webpack(myWebpackConfig))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('public/static/'));
}

function buildApp(myWebpackConfig) {
  const jsFilter = gulpFilter(['**/*.js']);
  return buildBaseApp(myWebpackConfig)
    .pipe(jsFilter)
    .pipe(uglify())
    .pipe(rename({
      suffix: '_min',
    }))
    .pipe(gulp.dest('public/static/'));
}

function buildHTML() {
  const revData = JSON.parse(fs.readFileSync('rev-version.json'));
  let stream = gulp.src('containers/**/*.html')
    .pipe(replaceRev(revData))
    .pipe(inlinesource({
      rootpath: path.join(__dirname, 'public'),
    }));
  if (isProductionEnv) {
    stream = stream.pipe(htmlmin({ // https://github.com/kangax/html-minifier
      removeComments: true,
      collapseWhitespace: true,
      collapseBooleanAttributes: true,
      removeTagWhitespace: true,
      removeRedundantAttributes: true,
      removeEmptyAttributes: true,
      useShortDoctype: true,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true,
      removeCDATASectionsFromCDATA: true,
    }));
  }
  return stream.pipe(gulp.dest('public'));
}

function replaceRev(revData) {
  const RE_JS_FILE = /(<script\s[^>]*src=)['"](.+?)['"]/g;
  const RE_ADD_MIN = /^(.+?)\.(.+)$/;
  return replace(RE_JS_FILE, ($0, $1, $2) => {
    const filename = $2.replace(/.*\//, '');
    let res = revData;
    filename.split('.').forEach(function (name) {
      res = typeof res === 'object' && res[name] || $2;
    });
    if (isProductionEnv) {
      res = res.replace(RE_ADD_MIN, '$1_min.$2');
    }
    return `${$1}"${res}"`;
  });
}

gulp.task('clean:app', (done) => {
  del(['public/static/**']).then(() => done());
});

gulp.task('clean:html', (done) => {
  del(['public/**/*.html']).then(() => done());
});

gulp.task('check:css', [], () => {
  return gulp.src(['src/**/*.scss', 'containers/**/*.scss'])
    .pipe(scsslint())
    .pipe(scsslint.failReporter());
});

gulp.task('check:js', [], () => {
  return gulp.src(['src/**/*.@(js|jsx)', 'containers/**/*.@(js|jsx)'])
    .pipe(eslint())
    .pipe(eslint.format('stylish'))
    .pipe(eslint.failAfterError())
    .pipe(jscs())
    .pipe(jscs.reporter('console'))
    .pipe(jscs.reporter('failImmediately'))
    .pipe(flow({ // https://www.npmjs.com/package/gulp-flowtype#options
      all: false,
      weak: false,
      declarations: './src/declarations',
      killFlow: false,
      beep: true,
      abort: true,
    }));
});

gulp.task('check:html', [], () => {
  return gulp.src('containers/**/*.html')
    .pipe(htmlhint('.htmlhintrc')) // https://github.com/yaniswang/HTMLHint/wiki/Rules
    .pipe(htmlhint.failReporter());
});

gulp.task('update:app', ['clean:app'], () => {
  return buildBaseApp(getWebpackConfig());
});

gulp.task('build:app', [
  'clean:app',
  'check:js', 'check:css', 'check:html',
], () => {
  return buildApp(getWebpackConfig());
});

gulp.task('build:html', ['clean:html', 'build:app'], () => {
  return buildHTML();
});

gulp.task('default', [
  'build:app',
  'build:html',
]);

gulp.task('deploy', [
]);

gulp.task('watch', () => {
  gulp.watch(['src/**'], ['update:app']);
  gulp.watch(['containers/**/*.html'], ['build:html']);
});

gulp.task('webserver', () => {
  gulp.src('public')
    .pipe(webserver({ // https://www.npmjs.com/package/gulp-webserver#options
      // livereload: true,
      // directoryListing: true,
      // open: true,
      port: process.env.MYAPP_DEVSERVER_PORT || 8000,
      host: process.env.MYAPP_DEVSERVER_HOST || 'localhost',
    }));
});
