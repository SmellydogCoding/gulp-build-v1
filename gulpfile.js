const gulp = require('gulp');
const concat = require('gulp-concat');
const maps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const del = require('del');
const sass = require('gulp-sass');
const converter = require('sass-convert');
const csso = require('gulp-csso');
const imagemin = require('gulp-imagemin');

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

gulp.task('sassconvert', function () {
  return gulp.src('sass/**/*+(sass|scss)')
    .pipe(converter({
      from: 'sass',
      to: 'scss',
      rename: true
    }))
    .pipe(gulp.dest('sasstemp'));
});

gulp.task('sasscompile', ['sassconvert'], function() {
  return gulp.src("sasstemp/global.scss")
      .pipe(rename('all.scss'))
      .pipe(maps.init())
      .pipe(sass())
      .pipe(maps.write('./'))
      .pipe(gulp.dest('dist/styles'));
});

gulp.task('sassminify', ['sasscompile'], function () {
    return gulp.src('dist/styles/all.css')
        .pipe(csso())
        .pipe(rename('all.min.css'))
        .pipe(gulp.dest('dist/styles'));
});

gulp.task('styles', ['sassminify'], function() {
  del(['dist/styles/all.css','sasstemp']);
});

gulp.task('images', () =>
    gulp.src('images/*')
        .pipe(imagemin())
        .pipe(gulp.dest('dist/content'))
);

gulp.task('clean', function() {
  del(['dist/scripts/all.js']);
});

gulp.task('default', function() {
  // place code for your default task here
});