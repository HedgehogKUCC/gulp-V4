import { src, dest, task, watch, series, parallel } from 'gulp';
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
const $ = gulpLoadPlugins();

const paths = {
  styles: {
    src: 'src/scss/*.scss',
    plugin: 'src/scss/plugins/**/*.scss',
    dest: 'dist/css'
  },
  scripts: {
    src: 'src/js/*.js',
    plugin: 'src/js/plugins/**/*.js',
    dest: 'dist/js'
  }
}

// https://gulpjs.com/docs/en/api/task
// Reminder: This API isn't the recommended pattern anymore - export your tasks.
task('copyHTML', (cb) => {
  src('src/**/*.html')
    .pipe(dest('./dist/'));
  cb();
});

export function style() {
  return src(paths.styles.src)
    .pipe($.sass().on('error', $.sass.logError))
    .pipe($.postcss([ autoprefixer(), cssnano() ]))
    .pipe($.concat('all.css'))
    .pipe(dest(paths.styles.dest));
}

export function stylePlugin() {
  return src(paths.styles.plugin)
    .pipe($.sass().on('error', $.sass.logError))
    .pipe($.postcss([ autoprefixer(), cssnano() ]))
    .pipe($.concat('chunk-vendors.css', { newLine: '' }))
    .pipe(dest(paths.styles.dest));
}

export function script() {
  return src(paths.scripts.src)
    .pipe($.babel({ presets: ['@babel/env'] }))
    .pipe($.concat('all.js'))
    .pipe(dest(paths.scripts.dest));
}

export function scriptPlugin() {
  return src(paths.scripts.plugin)
    .pipe($.babel({ presets: ['@babel/env'] }))
    .pipe($.concat('chunk-vendors.js'))
    .pipe(dest(paths.scripts.dest));
}

function watchFiles(cb) {
  watch(paths.styles.src, series(sass));
  watch(paths.scripts.src, series(babel));
  cb();
}

export { watchFiles as watch };

const build = series(parallel(style, stylePlugin, script, scriptPlugin));

export default build;
