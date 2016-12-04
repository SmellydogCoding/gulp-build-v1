const gulp = require('gulp');
const concat = require('gulp-concat');
const maps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const del = require('del');

gulp.task('concatJS', function() {
    return gulp.src(['js/**/*.js'])
    .pipe(maps.init())
    .pipe(concat('all.js'))
    .pipe(maps.write('./'))
    .pipe(gulp.dest('dist/scripts'));
});

gulp.task('minifyJS', ['concatJS'], function() {
  return gulp.src('dist/scripts/all.js')
    .pipe(uglify())
    .pipe(rename('all.min.js'))
    .pipe(gulp.dest('dist/scripts'));
});

gulp.task('scripts', ['minifyJS'], function() {
  del(['dist/scripts/all.js']);
});

gulp.task('clean', function() {
  del(['dist/scripts/all.js']);
});

gulp.task('default', function() {
  // place code for your default task here
});