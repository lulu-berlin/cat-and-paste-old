'use strict';

var gulp = require('gulp');

var jshint = require('gulp-jshint');
var inlineCSS = require('gulp-inline-css');
var modernizr = require('gulp-modernizr');
var concat = require('gulp-concat');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var inlinesource = require('gulp-inline-source');
var htmlmin = require('gulp-htmlmin');
var beautify = require('gulp-beautify');
var strip = require('gulp-strip-comments');

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
        .pipe(gulp.dest('app'));
});

gulp.task('modernizr', function() {
    return gulp.src('src/*.js')
        .pipe(modernizr({
            tests: ['videoautoplay']
        }))
        .pipe(gulp.dest('lib'));
});

gulp.task('concat-libs', function() {
    return gulp.src('lib/*.js')
        .pipe(concat('libs.js'))
        .pipe(strip())
        .pipe(beautify())
        .pipe(gulp.dest('app/js'));
});

gulp.task('browserify', function() {
    return browserify({
            entries: ['./src/main.js'],
            paths: ['./src/']
        })
        .bundle()
        .pipe(source('main.js'))
        .pipe(gulp.dest('app/js'));
});

gulp.task('copy-block', function() {
    return gulp.src('src/.block')
        .pipe(gulp.dest('dist/release'));
});

gulp.task('inline-js', function() {
    return gulp.src('app/index.html')
        .pipe(inlinesource({
            compress: false,
            rootpath: 'app/'
        }))
        .pipe(gulp.dest('dist'));
});

gulp.task('bundle', ['inline-css', 'modernizr', 'concat-libs', 'browserify', 'copy-block', 'inline-js'], function() {
    return gulp.src('dist/index.html')
        .pipe(htmlmin({
            collapseWhitespace: true,
            collapseInlineTagWhitespace: true,
            minifyCSS: true,
            minifyJS: true
        }))
        .pipe(gulp.dest('dist/release'));
});

gulp.task('watch', function() {
    gulp.watch('src/*', ['lint', 'bundle']);
});

gulp.task('default', ['lint', 'bundle', 'watch']);
