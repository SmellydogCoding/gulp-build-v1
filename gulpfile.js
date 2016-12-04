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
const eslint = require('gulp-eslint');

gulp.task('lint', () => {
  return gulp.src('js/**/*.js')
  .pipe(eslint({
    "env": {
      "browser": true,
      "node": true
    }
  }))
  .pipe(eslint.format())
  .pipe(eslint.failAfterError());
});

gulp.task('concatJS', gulp.series('lint', function(done) {
    return gulp.src(['js/**/*.js'])
    .pipe(maps.init())
    .pipe(concat('all.js'))
    .pipe(maps.write('./'))
    .pipe(gulp.dest('dist/scripts'));
}));

gulp.task('minifyJS', gulp.series('concatJS', function(done) {
  return gulp.src('dist/scripts/all.js')
    .pipe(uglify())
    .pipe(rename('all.min.js'))
    .pipe(gulp.dest('dist/scripts'));
}));

gulp.task('sassconvert', function () {
  return gulp.src('sass/**/*+(sass|scss)')
    .pipe(converter({
      from: 'sass',
      to: 'scss',
      rename: true
    }))
    .pipe(gulp.dest('sasstemp'));
});

gulp.task('sasscompile', gulp.series('sassconvert', function() {
  return gulp.src("sasstemp/global.scss")
      .pipe(rename('all.scss'))
      .pipe(maps.init())
      .pipe(sass())
      .pipe(maps.write('./'))
      .pipe(gulp.dest('dist/styles'));
}));

gulp.task('sassminify', gulp.series('sasscompile', function () {
    return gulp.src('dist/styles/all.css')
        .pipe(csso())
        .pipe(rename('all.min.css'))
        .pipe(gulp.dest('dist/styles'));
}));

gulp.task('scripts', gulp.series('minifyJS', function(done) {
  del(['dist/scripts/all.js']);
  done();
}));

gulp.task('styles', gulp.series('sassminify', function(done) {
  del(['dist/styles/all.css','sasstemp']);
  done();
}));

gulp.task('images', () =>
    gulp.src('images/*')
        .pipe(imagemin())
        .pipe(gulp.dest('dist/content'))
);

gulp.task('clean', function(done) {
  del(['dist']);
  done();
});

gulp.task('build', gulp.series('clean', 'scripts', 'styles', 'images', function(done) {
  done();
}));

gulp.task('default', gulp.series('build'));