'use strict';
let gulp = require ('gulp');
let gutil = require ('gulp-util');
let cssmin = require ('gulp-cssmin');
let sass = require ('gulp-sass');
let buffer = require ('vinyl-buffer');
let source = require ('vinyl-source-stream');
let babelify = require ('babelify');
let browserify = require ('browserify');
let watchify = require ('watchify');
let uglify = require ('gulp-uglify');
let gzip = require ('gulp-gzip');
let sourcemaps = require ('gulp-sourcemaps');

let dependencies = [
  'react',
  'react-dom',
  'react-router'
];
let stageDir = '../nightlife-stage';
let base = 'dist';

// setup default, local test and staging tasks
gulp.task ('default', ['html', 'images', 'server', 'server-production',
  'styles', 'vendor', 'browserify-watch', 'watch', 'watch-server-production']);
gulp.task ('server-local', ['html', 'images', 'server', 'server-test',
  'styles', 'vendor', 'browserify-watch', 'watch', 'watch-server-test']);
gulp.task ('stage', ['set-stage', 'html', 'images', 'server', 'server-production',
  'styles', 'vendor-stage', 'browserify-stage']);

// set the destination for staging output and copy stage root files
gulp.task ('set-stage', function () {
  base = stageDir + '/dist';
  return gulp.src (['stage/*', 'stage/.*'])
    .pipe (gulp.dest (stageDir));
});

// set watch tasks for continous build
gulp.task ('watch', function () {
  gulp.watch ('src/client/index.html', ['html']);
  gulp.watch ('src/client/images/*', ['images']);
  gulp.watch ('src/server/*.js', ['server']);
  gulp.watch (dependencies, ['vendor']);
  gulp.watch('src/client/css/*.scss', ['styles']);
});

gulp.task ('watch-server-production', function () {
  gulp.watch ('src/server-prod/*.js', ['server-production']);
});

gulp.task ('watch-server-test', function () {
  gulp.watch (['src/server-local/*.js', 'src/server-local/*.json'], ['server-test']);
});

// copy index.html and favicon.ico
gulp.task ('html', function () {
  return gulp.src (['src/client/index.html', 'src/client/favicon.ico'])
    .pipe (gulp.dest (base + '/public'));
});

// copy images
gulp.task ('images', function () {
  return gulp.src ('src/client/images/*.*')
    .pipe (gulp.dest (base + '/public/images'));
});

// copy server content
gulp.task ('server', function () {
  return gulp.src ('src/server/*.js')
    .pipe (gulp.dest (base));
});

gulp.task ('server-production', ['server'], function () {
  return gulp.src (['src/server-prod/*.js'])
    .pipe (gulp.dest (base));
});

gulp.task ('server-test', ['server'], function () {
  return gulp.src (['src/server-local/*.js', 'src/server-local/*.json'])
    .pipe (gulp.dest (base));
});

// compile third-party dependencies
gulp.task ('vendor', function () {
  return browserify ()
    .require (dependencies)
    .bundle ()
    .pipe (source ('vendor.bundle.js'))
    .pipe (buffer ())
    .pipe (uglify ({ mangle: false }))
    .pipe (gzip ({ append: true }))
    .pipe (gulp.dest (base + '/public/js'));
});

// compile stylesheets
gulp.task ('styles', function () {
  return gulp.src ('src/client/css/main.scss')
    .pipe (sass ().on ('error', sass.logError))
    .pipe (cssmin ())
    .pipe (gulp.dest (base + '/public/css'));
});

// compile and package application
gulp.task ('browserify-watch', function () {
  let bundler = watchify (browserify ({ entries: 'src/client/main/components/App.jsx', debug: true }, watchify.args));
  bundler.external (dependencies);
  bundler.transform (babelify, { presets: ['es2015', 'react'] });
  bundler.on ('update', rebundle);
  return rebundle ();

  function rebundle () {
    let start = Date.now ();
    return bundler.bundle ()
      .on ('error', function (err) {
        gutil.log (gutil.colors.red (err.toString ()));
      })
      .on ('end', function () {
        gutil.log (gutil.colors.green ('Finished rebundling in', (Date.now () - start) + 'ms.'));
      })
      .pipe (source ('bundle.js'))
      .pipe (buffer ())
      .pipe (gzip ({ append: true }))
      .pipe (sourcemaps.init ({ loadMaps: true }))
      .pipe (sourcemaps.write ('.'))
      .pipe (gulp.dest (base + '/public/js/'));
  }
});

// Tasks to prepare staging version of application
gulp.task ('vendor-stage', function () {
  process.env.NODE_ENV = 'production';
  return browserify ()
    .require (dependencies)
    .bundle ()
    .pipe (source ('vendor.bundle.js'))
    .pipe (buffer ())
    .pipe (uglify ({ mangle: false }))
    .pipe (gzip ({ append: true }))
    .pipe (gulp.dest (base + '/public/js'));
});

gulp.task ('browserify-stage', function () {
  process.env.NODE_ENV = 'production';
  let bundler = browserify ({ entries: 'src/client/main/components/App.jsx', debug: true });
  bundler.external (dependencies);
  bundler.transform (babelify, { presets: ['es2015', 'react'] });
  bundler.on ('update', rebundle);
  return rebundle ();

  function rebundle () {
    let start = Date.now ();
    return bundler.bundle ()
      .on ('error', function (err) {
        gutil.log (gutil.colors.red (err.toString ()));
      })
      .on ('end', function () {
        gutil.log (gutil.colors.green ('Finished rebundling in', (Date.now () - start) + 'ms.'));
      })
      .pipe (source ('bundle.js'))
      .pipe (buffer ())
      .pipe (uglify ({ mangle: false }))
      .pipe (gzip ({ append: true }))
      .pipe (gulp.dest (base + '/public/js/'));
  }
});
