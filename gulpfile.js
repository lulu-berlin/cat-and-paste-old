'use strict';
var gulp = require('gulp');

var browserify = require('browserify');

var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

var modernizr = require('gulp-modernizr');

var source = require('vinyl-source-stream');

var inlineCSS = require('gulp-inline-css');

var inlinesource = require('gulp-inline-source');

var htmlmin = require('gulp-htmlmin');

gulp.task('lint', function() {
    return gulp.src('src/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('inline-css', function() {
    return gulp.src('src/*.html')
        .pipe(inlineCSS({
            removeStyleTags: false
        }))
        .pipe(gulp.dest('out'));
});

gulp.task('modernizr', function() {
    return gulp.src('src/*.js')
        .pipe(modernizr({
            tests: ['videoautoplay']
        }))
        .pipe(gulp.dest('out'));
});

gulp.task('browserify', function() {
    return browserify('src/catandpaste.js')
        .bundle()
        .pipe(source('index.js'))
        .pipe(gulp.dest('out'));
});

gulp.task('bundle', ['inline-css', 'modernizr', 'browserify'], function() {
    return gulp.src('out/index.html')
        .pipe(inlinesource())
        .pipe(gulp.dest('dist'))
        .pipe(htmlmin({
            collapseWhitespace: true,
            collapseInlineTagWhitespace: true,
            minifyCSS: true,
            minifyJS: true
        }))
        .pipe(gulp.dest('dist'));
});

gulp.task('watch', function() {
    gulp.watch('src/*', ['lint', 'bundle']);
});

gulp.task('default', ['lint', 'bundle', 'watch']);
