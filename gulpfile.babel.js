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


// https://gulpjs.com/docs/en/api/task
// Reminder: This API isn't the recommended pattern anymore - export your tasks.
task('copyHTML', (cb) => {
  src('./src/**/*.html')
    .pipe(dest('./dist/'));
  cb();
});

export function sass() {
  return src('./src/scss/**/*.scss')
    .pipe($.sass().on('error', $.sass.logError))
    .pipe($.postcss([ autoprefixer(), cssnano() ]))
    .pipe(dest('./dist/css'));
}

function watching() {
  return watch('./src/scss/**/*.scss', series(sass));
}

exports.default = parallel(sass, watching);
