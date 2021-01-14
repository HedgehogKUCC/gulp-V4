const { src, dest, task, watch, series, parallel } = require('gulp');
const gulpSass = require('gulp-sass');

task('copyHTML', (cb) => {
  src('./src/**/*.html')
    .pipe(dest('./dist/'));
  cb();
});

function sass() {
  return src('./src/scss/**/*.scss')
    .pipe(gulpSass().on('error', gulpSass.logError))
    .pipe(dest('./dist/css'));
}

function watching() {
  return watch('./src/scss/**/*.scss', series(sass));
}

exports.default = parallel(sass, watching);
