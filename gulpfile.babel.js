import { src, dest, watch, series, parallel } from 'gulp';
// const { src, dest, task, watch, series, parallel } = require('gulp');

// 使用 gulp-load-plugins 後，gulp-* 的套件就可以由 gulp-load-plugins 引入
// const gulpSass = require('gulp-sass');
// const postcss = require('gulp-postcss');

// const autoprefixer = require('autoprefixer');
// const cssnano = require('cssnano');
// const $ = require('gulp-load-plugins')();
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';
import gulpLoadPlugins from 'gulp-load-plugins';
import del from 'del';
import browserSync from 'browser-sync';

const $ = gulpLoadPlugins();
const browser = browserSync.create();

const paths = {
  styles: {
    src: 'src/scss/*.scss',
    dest: 'dist/css',
  },
  scripts: {
    src: 'src/js/*.js',
    dest: 'dist/js',
  },
};

export function clean() {
  return del(['dist']);
}

// https://gulpjs.com/docs/en/api/task
// Reminder: This API isn't the recommended pattern anymore - export your tasks.
// task('copyHTML', (cb) => {
//   src('src/**/*.html')
//     .pipe(dest('./dist/'));
//   cb();
// });

export function copyHTML() {
  return src('src/**/*.html')
    .pipe(dest('./dist'))
    .pipe(browser.stream());
}

export function style() {
  return src(paths.styles.src)
    .pipe($.sourcemaps.init())
    .pipe($.sass().on('error', $.sass.logError))
    .pipe($.postcss([autoprefixer(), cssnano()]))
    .pipe($.concat('all.css'))
    .pipe($.sourcemaps.write('.'))
    .pipe(dest(paths.styles.dest))
    .pipe(browser.stream());
}

export function stylePlugin() {
  return src([
    'node_modules/bootstrap/dist/css/bootstrap.min.css',
  ])
    .pipe($.concat('chunk-vendors.css', { newLine: '' }))
    .pipe($.cleanCss({ level: { 1: { specialComments: 0 } } }))
    .pipe(dest(paths.styles.dest));
}

export function script() {
  return src(paths.scripts.src)
    .pipe($.sourcemaps.init())
    .pipe($.babel({ presets: ['@babel/env'] }))
    .pipe($.concat('all.js'))
    .pipe($.uglify({ compress: { drop_console: true } }))
    .pipe($.sourcemaps.write('.'))
    .pipe(dest(paths.scripts.dest))
    .pipe(browser.stream());
}

export function scriptPlugin() {
  return src([
    'node_modules/jquery/dist/jquery.min.js',
    'node_modules/popper.js/dist/popper.min.js',
    'node_modules/bootstrap/dist/js/bootstrap.min.js',
  ])
    .pipe($.concat('chunk-vendors.js'))
    .pipe(dest(paths.scripts.dest));
}

function watchFiles(cb) {
  watch(paths.styles.src, series(style));
  watch(paths.scripts.src, series(script));
  cb();
}

export function openBrowser(cb) {
  browser.init({
    server: {
      baseDir: './dist',
    },
    reloadDebounce: 1000,
  });

  watch(paths.styles.src, series(style));
  watch(paths.scripts.src, series(script));
  watch('./src/index.html', series(copyHTML));
  cb();
}

export { watchFiles as watch };

const build = series(clean, parallel(copyHTML, style, stylePlugin, script, scriptPlugin), openBrowser);

export default build;
