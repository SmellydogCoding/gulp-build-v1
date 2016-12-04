const gulp      = require('gulp');
const concat    = require('gulp-concat');
const maps      = require('gulp-sourcemaps');
const uglify    = require('gulp-uglify');
const rename    = require('gulp-rename');
const del       = require('del');
const sass      = require('gulp-sass');
const converter = require('sass-convert');
const csso      = require('gulp-csso');
const imagemin  = require('gulp-imagemin');
const eslint    = require('gulp-eslint');

// linter for the .js files
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

// concatinates .js files, runs after linter finishes
gulp.task('concatJS', gulp.series('lint', () => {
    return gulp.src(['js/**/*.js'])
    .pipe(maps.init())
    .pipe(concat('all.js'))
    .pipe(maps.write('./'))
    .pipe(gulp.dest('dist/scripts'));
}));

// minifies concatinated .js file, runs after concatinator finishes
gulp.task('minifyJS', gulp.series('concatJS', () => {
  return gulp.src('dist/scripts/all.js')
    .pipe(uglify())
    .pipe(rename('all.min.js'))
    .pipe(gulp.dest('dist/scripts'));
}));

// converts all .sass files to .scss (compiler fails on .sass files)
gulp.task('sassconvert', () => {
  return gulp.src('sass/**/*+(sass|scss)')
    .pipe(converter({
      from: 'sass',
      to: 'scss',
      rename: true
    }))
    .pipe(gulp.dest('sasstemp'));
});

// compile sass to css, runs after sass converter finishes
gulp.task('sasscompile', gulp.series('sassconvert', () => {
  return gulp.src("sasstemp/global.scss")
      .pipe(rename('all.scss'))
      .pipe(maps.init())
      .pipe(sass())
      .pipe(maps.write('./'))
      .pipe(gulp.dest('dist/styles'));
}));

// minifies the css file, runs after the sass compiler finishes
gulp.task('sassminify', gulp.series('sasscompile', () => {
    return gulp.src('dist/styles/all.css')
        .pipe(csso())
        .pipe(rename('all.min.css'))
        .pipe(gulp.dest('dist/styles'));
}));

// runs the lint, concatJS, and minifyJS tasks
gulp.task('scripts', gulp.series('minifyJS', (done) => {
  del(['dist/scripts/all.js']);
  done();
}));

// runs the sassconvert, sasscompile, and sassminify tasks
gulp.task('styles', gulp.series('sassminify', (done) => {
  del(['dist/styles/all.css','sasstemp']);
  done();
}));

// optimizes images
gulp.task('images', () =>
    gulp.src('images/*')
        .pipe(imagemin())
        .pipe(gulp.dest('dist/content'))
);

// deletes the dist folder
gulp.task('clean', (done) => {
  del(['dist']);
  done();
});

// runs the scripts, styles, and images tasks in parallel
gulp.task('buildtasks', gulp.parallel('scripts', 'styles', 'images'));

// runs the clean task, runs the buildtasks tasks after clean finishes
gulp.task('build', gulp.series('clean', 'buildtasks', (done) => {
  done();
}));

gulp.task('default', gulp.series('build'));