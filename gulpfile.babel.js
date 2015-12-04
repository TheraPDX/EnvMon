'use strict';

var watchify    = require('watchify');
var babelify    = require('babelify');
var browserify  = require('browserify');
var gulp        = require('gulp');
var source      = require('vinyl-source-stream');
var buffer      = require('vinyl-buffer');
var gutil       = require('gulp-util');
var webserver   = require('gulp-webserver');

// add options to babelify
var options           = watchify.args;
  options.entries     = 'src/js/main.jsx';
  options.extensions  = ['.jsx'];

// prepare browserify object
var w = watchify(browserify(options)).transform(babelify.configure({
  ignore: /(bower_components)|(node_modules)/
}));
w.on('update', bundle);
w.on('log', gutil.log);

// builder function
function bundle() {
    return w.bundle()
        .on('error', gutil.log.bind(gutil, 'Browserify Error'))
        .pipe(source('bundle.js'))
        .pipe(buffer())
        .pipe(gulp.dest('dist/'));
}

// task and listeners
gulp.task('browserify', bundle);

gulp.task('webserver', function() {
  return gulp.src('./')
    .pipe(webserver({
       livereload: true,
       host: '0.0.0.0',
       port: 12345,
       directoryListing: false,
       open: false
     }));
});

gulp.task('default', ['webserver', 'browserify']);
