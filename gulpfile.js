
const del = require('del');
const gulp = require('gulp');
const runSequence = require('run-sequence');
const gulpLoadPlugins = require('gulp-load-plugins');

const $ = gulpLoadPlugins();

const srcFolder = 'src';
const outFolder = 'build';

gulp.task('clean', () => del(`${outFolder}`, { force: true }));

gulp.task('dev:js', () => {
  return gulp.src([`${srcFolder}/scripts/**/*.js`])
    .pipe($.sourcemaps.init())
      .pipe($.babel({ presets: ['es2015'] }))
      .pipe($.concat('main.js'))
    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest(`${outFolder}/scripts`))
    .pipe($.livereload());
});

gulp.task('dev:jade:views', () => {
  return gulp.src([`${srcFolder}/views/**/*.jade`])
    .pipe($.jade())
    .pipe(gulp.dest(`${outFolder}/views`))
    .pipe($.livereload());
});

gulp.task('dev:jade:index', () => {
  return gulp.src([`${srcFolder}/index.jade`])
    .pipe($.wiredep())
    .pipe($.jade({ pretty: true }))
    .pipe($.usemin())
    .pipe(gulp.dest(`${outFolder}`))
    .pipe($.livereload());
});

gulp.task('dev:scss', () => {
  return gulp.src([`${srcFolder}/styles/**/*.scss`])
    .pipe($.sass.sync())
    .pipe(gulp.dest(`${outFolder}/styles`))
    .pipe($.livereload());
});

gulp.task('dev:assets', () => {
  return gulp.src([`${srcFolder}/assets/**/*`])
    .pipe(gulp.dest(`${outFolder}/assets`))
    .pipe($.livereload());
});

gulp.task('dev:jade', ['dev:jade:index', 'dev:jade:views']);

gulp.task('dev:build', ['dev:js', 'dev:jade', 'dev:scss', 'dev:assets']);

gulp.task('dev:serve', ['dev:build'], () => {
  return gulp.src(`${outFolder}`)
    .pipe($.webserver({
      open: true,
      port: '9000',
      host: 'localhost',
      livereload: true
    }));
});

gulp.task('dev:watch', () => {
  gulp.watch(`${srcFolder}/index.jade`, ['dev:jade:index']);
  gulp.watch(`${srcFolder}/assets/**/*`, ['dev:assets']);
  gulp.watch(`${srcFolder}/scripts/**/*.js`, ['dev:js']);
  gulp.watch(`${srcFolder}/styles/**/*.scss`, ['dev:scss']);
  gulp.watch(`${srcFolder}/views/**/*.jade`, ['dev:jade:views']);
});

gulp.task('dev', (done) => runSequence('clean', 'dev:serve', 'dev:watch', done));

