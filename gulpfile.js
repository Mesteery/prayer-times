const gulp = require('gulp');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');

gulp.task('default', () => {
  return gulp.src('src/index.js')
    .pipe(babel({
      presets: ['@babel/env'],
      plugins: ['@babel/plugin-proposal-class-properties']
    }))
    .pipe(gulp.dest('dist'))
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('dist'));
});