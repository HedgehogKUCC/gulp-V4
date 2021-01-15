const { src, dest, task, watch, series, parallel } = require('gulp');
const gulpSass = require('gulp-sass');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');

// https://gulpjs.com/docs/en/api/task
// Reminder: This API isn't the recommended pattern anymore - export your tasks.
task('copyHTML', (cb) => {
  src('./src/**/*.html')
    .pipe(dest('./dist/'));
  cb();
});

function sass() {
  return src('./src/scss/**/*.scss')
    .pipe(gulpSass().on('error', gulpSass.logError))
    .pipe(postcss([ autoprefixer(), cssnano() ]))
    .pipe(dest('./dist/css'));
}

function watching() {
  return watch('./src/scss/**/*.scss', series(sass));
}

exports.sass = sass;
exports.default = parallel(sass, watching);
